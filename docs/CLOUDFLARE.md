# Publicar CVonline en Cloudflare Pages

Esta guía describe cómo publicar desde `SSJ-ARIEL/CVonline`, rama `main`. Las credenciales se introducen únicamente mediante variables de entorno seguras.

## Publicación desde Codex o una terminal

Configura `CLOUDFLARE_API_TOKEN` como secreto con permiso **Account → Cloudflare Pages → Edit** para la cuenta correspondiente. `CLOUDFLARE_ACCOUNT_ID` es el identificador de cuenta de 32 caracteres; no es el token. Nunca pegues el token en el chat ni lo guardes en Git.

```bash
npm run deploy:cloudflare
```

El script usa Wrangler 4.149.0, reutiliza el proyecto `cvonline` o crea uno de Direct Upload, obtiene su dominio real, compila con ese origen y publica `dist` en la rama de producción `main`. Puedes cambiar el nombre con `CLOUDFLARE_PAGES_PROJECT`. El código permanece en GitHub. Con Direct Upload, las actualizaciones se publican ejecutando de nuevo este comando; no se conectan automáticamente a cada push. Cloudflare no permite convertir después ese proyecto a integración Git: si prefieres compilación automática, crea desde el inicio un proyecto conectado a Git siguiendo la sección siguiente. Los proyectos Git existentes también admiten despliegues manuales con Wrangler.

## Archivo ZIP opcional

El despliegue directo evita tener que descargar un ZIP. La compilación distribuye el runtime local en gzip: el navegador recupera el binario original en memoria mediante `DecompressionStream` y la opción oficial `wasmBinary` de ONNX Runtime. El build verifica que la descompresión conserva todos los bytes de la dependencia instalada. Esto reduce el archivo de aproximadamente 14,3 MB a 3,7 MB sin quitar la traducción ni alterar el runtime.

Si prefieres cargar una compilación manualmente, genera un ZIP con el contenido de `dist` directamente en su raíz y súbelo en **Workers & Pages → cvonline → Create deployment → Production**. No incluyas `node_modules`, credenciales, archivos `.env` ni una carpeta superior. Usa siempre una compilación reciente con el dominio real; un ZIP anterior puede contener archivos obsoletos.

## 1. Conectar el repositorio

En la cuenta de Cloudflare, abre **Workers & Pages** y crea un proyecto de **Pages** conectado a Git. Autoriza el acceso al repositorio de GitHub que contiene CVonline y selecciona `main` como rama de producción. Los nombres de las opciones pueden variar según la versión del panel.

GitHub conserva el código y su historial; Cloudflare aloja los archivos de la web. No necesitas GitHub Pages, una base de datos, autenticación de usuarios ni un servidor de currículums.

## 2. Configurar la compilación

| Campo | Valor |
| --- | --- |
| Directorio raíz | Raíz del repositorio |
| Rama de producción | `main` |
| Comando de compilación | `npm run build` |
| Directorio de salida | `dist` |
| `NODE_VERSION` | `24` |
| `ONNXRUNTIME_NODE_INSTALL_CUDA` | `skip` |

Pages instala las dependencias antes de compilar. El repositorio incluye `package-lock.json`; comprueba en el registro de compilación que se respeta el bloqueo. Para una instalación manual o un sistema de CI donde controles este paso, utiliza `ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm ci` y después `npm run build`.

El instalador de ONNX incluye componentes para otros entornos. `skip` evita descargar CUDA, que la traducción de esta web no utiliza. Configura la variable **antes de la instalación**, no únicamente en el comando final de compilación. Mantén las comprobaciones TLS y de integridad de npm activadas.

El build prepara la aplicación, prepara una copia comprimida y verificada del runtime WebAssembly instalado y genera 52 documentos HTML públicos en cuatro idiomas. El directorio temporal `.prerender/`, `node_modules/` y los archivos locales de entorno están excluidos de Git.

## 3. Definir los datos reales del sitio

Completa las variables públicas indicadas en `.env.example` para producción y, si procede, para previews:

- `VITE_OPERATOR_NAME`: nombre real del responsable.
- `VITE_CONTACT_EMAIL`: correo público real de contacto.
- `VITE_SITE_URL`: origen HTTPS definitivo, sin rutas ni parámetros.
- `VITE_ADSENSE_READY=false`: mantener mientras no esté lista la monetización.
- `VITE_ADSENSE_CLIENT`: identificador público real `ca-pub-…`; genera la verificación HTML y `ads.txt` sin activar anuncios.
- `VITE_GOOGLE_SITE_VERIFICATION`: solo el valor `content` de la etiqueta HTML de Search Console, no la etiqueta completa.

No incluyas secretos en variables `VITE_*`: se incorporan al JavaScript público. Los datos del responsable y contacto no se inventan; el propietario debe proporcionarlos para completar las páginas informativas y solicitar monetización.

En el primer despliegue todavía puede no conocerse la dirección asignada. Puedes dejar `VITE_SITE_URL` vacío, comprobar la URL real del proyecto y volver a compilar con ese origen. Mientras esté vacío, no se generan enlaces canónicos ni sitemap con una dirección supuesta.

## 4. Dirección gratuita y dominio posterior

El proyecto de esta cuenta se llama `cvonline`; Cloudflare le asignó **https://cvonline-zw0.pages.dev**. El script consulta el dominio de la cuenta antes de cada compilación para evitar publicar enlaces canónicos con una dirección supuesta.

Cloudflare Pages asigna un subdominio bajo `pages.dev`. Escoge un nombre disponible en el panel; **no se ha reservado ni comprobado `cvonline.pages.dev`**. No confundas esta dirección gratuita con la propiedad de un dominio independiente.

Cuando decidas adquirir un dominio, añádelo mediante la sección de dominios personalizados del proyecto y sigue las instrucciones DNS de Cloudflare. Configura `VITE_SITE_URL` con el origen nuevo y vuelve a desplegar. El registro y la renovación del dominio tienen un coste separado; revisa ambos antes de comprar. La migración del nombre no requiere mover el código fuera de GitHub.

## 5. Rutas y cabeceras

Los archivos `public/_redirects` y `public/_headers` se copian a `dist` y están preparados para Pages:

- Las páginas públicas prerenderizadas se sirven como HTML, incluidas las guías por idioma.
- Las rutas `/language`, `/cv-type`, `/profile`, `/builder/*` y `/review` funcionan como navegación de la aplicación.
- Las pantallas con datos personales no forman parte del sitemap y se marcan para evitar indexación.
- El editor utiliza `Cache-Control: no-store`; las cabeceras también restringen acceso a cámara, micrófono y geolocalización y bloquean la inclusión de la web en un iframe.

`_redirects` contiene comentarios y no añade una regla global. Pages sirve los archivos existentes y proporciona el fallback de una SPA cuando no existe `404.html` en la raíz. Así se conservan los HTML públicos y los recursos de la aplicación. No añadas `/* /index.html 200`: las reglas de redirección de Pages tienen prioridad incluso cuando existe un archivo y esa regla interceptaría las guías, JavaScript y WebAssembly. Tampoco añadas un `404.html` raíz sin configurar antes las rutas del editor.

Referencias oficiales: [archivos y fallback SPA](https://developers.cloudflare.com/pages/configuration/serving-pages/) y [prioridad de redirecciones](https://developers.cloudflare.com/pages/configuration/redirects/).

Cuando `VITE_SITE_URL` contiene un origen HTTPS válido, la compilación añade `dist/sitemap.xml`, su referencia en `robots.txt`, enlaces canónicos y alternativas de idioma. Comprueba los archivos del despliegue real antes de solicitar indexación.

## 6. Revisar el sitio publicado

Comprueba en escritorio y móvil:

1. Portada, navegación y cambio de los cuatro idiomas.
2. Elección de tipo después del idioma, diseños compatibles y regreso entre pantallas sin perder respuestas durante la sesión.
3. Datos de contacto, formación, experiencia, proyectos y secciones adicionales.
4. Foto opcional y selección de ocho tipos y visualización de sus 400 diseños (50 por tipo), búsqueda, carga progresiva y seis tipografías.
5. PDF descargado con texto seleccionable y Word editable; apertura de archivos cortos y largos, caracteres acentuados, foto y saltos de página.
6. Cada guía abierta por su URL, incluida una recarga directa.
7. Descartar y reiniciar; confirmar que una recarga no recupera las respuestas.
8. Traducción real, con permisos de descarga de modelos, en los navegadores y dispositivos admitidos.
9. Nombre del responsable y contacto reales en las páginas informativas; ausencia de anuncios antes de activarlos.

La traducción de respaldo requiere acceso HTTPS a Hugging Face y a su CDN de archivos. En el entorno de desarrollo, un CDN devolvió HTTP 403 y no permitió verificar la inferencia completa. Una compilación correcta por sí sola no acredita que se puedan descargar o ejecutar los modelos en el dispositivo del visitante. No deshabilites TLS ni cambies a un servicio remoto que reciba los datos del currículum para resolverlo.

## 7. Verificar AdSense y solicitar revisión

Mantén la publicidad desactivada hasta tener una web pública revisada y la autorización correspondiente de Google. El contenido original y una interfaz funcional ayudan a presentar un sitio completo, pero ningún alojamiento o dominio garantiza aprobación o ingresos.

Google permite añadir subdominios de plataformas incluidas en la [Public Suffix List](https://support.google.com/adsense/answer/12170421); `pages.dev` figura en ella. Puedes presentar `cvonline-zw0.pages.dev` sin comprar primero un dominio. La aprobación depende de la revisión del sitio y de la cuenta. Si el formulario inicial de alta rechaza el subdominio, crea la cuenta con la opción «No tengo un sitio todavía» y añade después la dirección desde **Sitios**.

1. En AdSense, abre **Sitios → Nuevo sitio** y añade `cvonline-zw0.pages.dev`.
2. Obtén el ID público de editor y configura `VITE_ADSENSE_CLIENT`; conserva `VITE_ADSENSE_READY=false` y vuelve a desplegar.
3. Selecciona el método de [verificación por etiqueta meta](https://support.google.com/adsense/answer/7584263). Comprueba `google-adsense-account` en el HTML y `/ads.txt` con el ID correcto; ambos se generan sin ejecutar anuncios.
4. En el panel, confirma la verificación y solicita la revisión. La API pública de AdSense permite consultar sitios, pero no añadirlos ni solicitar revisión. Estos pasos requieren acceder a la cuenta de Google.
5. Configura el mensaje de consentimiento europeo certificado de Google u otra CMP admitida. La elección del sitio no sustituye una CMP.

Antes de habilitar los anuncios:

- Solicita y obtén la aprobación del sitio en AdSense con la dirección que realmente utilizarás.
- Completa el responsable y el contacto público y actualiza la información de privacidad según la configuración real.
- Configura una plataforma o mensaje de consentimiento certificado por Google cuando las políticas y mercados atendidos lo requieran. El aviso de elección de CVonline **no es una CMP certificada**.
- Introduce el `VITE_ADSENSE_CLIENT` real y cambia `VITE_ADSENSE_READY` a `true`; vuelve a compilar.
- Verifica que los anuncios se cargan únicamente en páginas públicas y que entrar al editor crea un documento limpio de código publicitario antes de introducir datos.

La compilación genera el meta `google-adsense-account` y `ads.txt` cuando se configura un cliente válido, incluso con `VITE_ADSENSE_READY=false`. Así se puede comprobar la propiedad sin cargar publicidad. Comprueba su contenido y acceso público junto con las instrucciones de tu cuenta.

El loader ya previsto es un punto de integración; la aceptación de AdSense, la CMP y su funcionamiento efectivo deben verificarse después de configurar la cuenta real. No son parte de una aprobación automática proporcionada por este repositorio.


## 8. Search Console

1. En [Search Console](https://search.google.com/search-console), añade una propiedad **Prefijo de URL** con `https://cvonline-zw0.pages.dev/`. No elijas propiedad Dominio: no controlas el DNS de `pages.dev`.
2. Selecciona **Etiqueta HTML** y copia el valor `content` de `google-site-verification` a `VITE_GOOGLE_SITE_VERIFICATION`. Es un código de verificación público; no necesita una contraseña en el repositorio.
3. Vuelve a desplegar. Confirma que el meta aparece en el HTML original de la portada, no solo después de ejecutar JavaScript.
4. Pulsa **Verificar** en la cuenta de Google. Mantén el meta en los siguientes despliegues.
5. En **Sitemaps**, envía `https://cvonline-zw0.pages.dev/sitemap.xml`.

El sitemap contiene las 52 páginas públicas y excluye las pantallas de datos personales. Publicar o enviar el sitemap no garantiza indexación. La API de Search Console requiere autorización OAuth de la cuenta propietaria; el token de Cloudflare no concede acceso a Google.

Referencias oficiales: [verificación HTML](https://support.google.com/webmasters/answer/9008080), [sitemaps](https://support.google.com/webmasters/answer/7451001) y [consentimiento certificado](https://support.google.com/adsense/answer/13554116).
