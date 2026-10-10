# CVonline

CVonline ayuda a crear un currículum mediante preguntas guiadas, elegir un diseño y descargarlo en PDF o Word. La interfaz es oscura, adaptable a móvil y disponible en español, inglés, italiano y portugués. No requiere cuentas ni un servidor de datos personales.

![Portada de CVonline](docs/preview-desktop.png)

El recorrido utiliza pantallas independientes: **portada → idioma → perfil → preguntas → diseños → revisión → descarga**. Las preguntas cubren datos de contacto, experiencia, formación, proyectos, habilidades, idiomas, certificaciones y presentación profesional. El usuario puede volver a sus respuestas antes de descargar.

## Funciones

- 17 diseños originales, de una o dos columnas, agrupados por estilo profesional.
- Foto opcional, procesada en el navegador, sin subirla a un servidor.
- Personalización de color, tamaño del texto y papel A4 o Carta.
- PDF con texto seleccionable y documentos de varias páginas cuando el contenido lo requiere.
- Word editable: conserva el contenido y adapta el diseño a una columna para facilitar la edición. No reproduce exactamente las composiciones de dos columnas del PDF.
- Cuatro idiomas para preguntas, interfaz, guías y títulos del documento; traducción del contenido descriptivo en el dispositivo, sujeta a disponibilidad del navegador y descarga de modelos.
- Seis guías originales por idioma, además de las páginas de información, privacidad y condiciones.

Las respuestas y la foto solo permanecen en la memoria de la pestaña. **Recargar o cerrar elimina el trabajo.** No hay recuperación de sesiones. La descarga se guarda en el dispositivo donde el usuario decida.

## Desarrollo local

Requisitos: Node.js 24, npm y acceso al registro de paquetes. El repositorio contiene el archivo de bloqueo `package-lock.json`; utilízalo para instalaciones repetibles. Cada tarea en la nube ya tiene un entorno aislado: trabaja en este checkout existente; no crees un worktree salvo que el usuario lo solicite.

```bash
cd /workspace/CVonline
ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm ci
npm run dev
```

El servidor de desarrollo escucha en `0.0.0.0`; Vite muestra el puerto disponible, normalmente `5173`. En otro sistema, sustituye la ruta del ejemplo por la de tu checkout. En PowerShell, configura primero `$env:ONNXRUNTIME_NODE_INSTALL_CUDA = 'skip'` y ejecuta `npm ci`.

`ONNXRUNTIME_NODE_INSTALL_CUDA=skip` es una opción del instalador de ONNX Runtime que evita descargar los componentes CUDA, innecesarios para esta web. La traducción usa WebAssembly en el navegador. No se deshabilitan verificaciones TLS ni de integridad. No uses `npm install` para una preparación rutinaria: puede cambiar el archivo de bloqueo.

```bash
npm run typecheck
npm run build
npm run preview
```

`npm run build` comprueba TypeScript, copia los recursos WebAssembly desde la dependencia instalada, genera la aplicación y prerenderiza 52 páginas públicas en `dist/`. Las pantallas con datos del usuario continúan funcionando en el navegador. `npm run preview` sirve el resultado compilado; no sustituye una comprobación en el alojamiento final.

## Pruebas

Las pruebas de navegador utilizan Playwright. Antes de ejecutarlas, instala Chromium y sus dependencias en una máquina compatible:

```bash
npx playwright install --with-deps chromium
# Linux: instalar poppler-utils para comprobar el texto y las páginas del PDF.
npm run build
npm test
```

`npm test` comprueba la versión de producción compilada. En Linux, las pruebas de PDF requieren `poppler-utils` (`pdftotext`, `pdfinfo` y `pdfimages`); en macOS, instala Poppler con el gestor de paquetes de tu sistema. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` permite indicar un Chromium existente. `npm run test:ui` abre el modo interactivo. Si el entorno no permite instalar dependencias del sistema, utiliza su navegador de pruebas ya disponible o solicita los permisos correspondientes. La comprobación del recorrido no sustituye revisar los documentos exportados y realizar una traducción real en los dispositivos de destino.

## Configuración pública

La aplicación puede ejecutarse sin variables. Para configurar la publicación, copia `.env.example` a `.env.local` o define los campos equivalentes en Cloudflare. Los valores `VITE_*` se incluyen en los archivos públicos: **no son secretos**. No pongas tokens, claves privadas ni credenciales en ellos.

| Variable | Uso |
| --- | --- |
| `VITE_SITE_URL` | Origen HTTPS real publicado, sin ruta. Genera las URL canónicas, alternativas por idioma y `sitemap.xml`. Déjala vacía mientras no exista una dirección definitiva. |
| `VITE_OPERATOR_NAME` | Nombre real del responsable de la web, mostrado en las páginas informativas. Completar antes de publicar. |
| `VITE_CONTACT_EMAIL` | Correo público real de contacto. Completar antes de publicar. |
| `VITE_ADSENSE_CLIENT` | Identificador público asignado por AdSense, con formato `ca-pub-` y 16 dígitos. No inventar uno. |
| `VITE_ADSENSE_READY` | `false` por defecto. Cambiar a `true` únicamente después de la aprobación y configuración de consentimiento necesarias. |

Los cambios de estas variables requieren una nueva compilación. Consulta [despliegue en Cloudflare](docs/CLOUDFLARE.md) y [tratamiento de datos](docs/PRIVACY.md).

## Traducción local

Cuando está disponible, se utiliza la implementación local de la API Translator de Google Chrome. El respaldo utiliza Transformers.js y modelos Marian ejecutados en un Web Worker con WebAssembly. No existe un endpoint de traducción al que se envíe el currículum.

El respaldo descarga archivos públicos desde Hugging Face: aproximadamente **108 MiB de pesos por dirección**, además de tokenizadores y runtime. Entre español, italiano y portugués se utiliza el inglés como idioma intermedio, por lo que se necesitan unos **216 MiB de pesos**. Es una operación exigente para conexiones móviles y dispositivos con poca memoria. Los modelos del respaldo no se guardan en almacenamiento persistente por la aplicación; puede ser necesario descargarlos en cada uso. El navegador administra los recursos de su propia API nativa.

La traducción está implementada, pero **la inferencia completa del respaldo no pudo validarse en el entorno de desarrollo porque el CDN de modelos devolvió HTTP 403**. Debe probarse con acceso a esos archivos y en navegadores de destino antes de presentarla como función verificada. Si falla, las respuestas originales se conservan y el usuario puede redactar directamente en el idioma deseado. Nombres propios y datos de contacto no se traducen; los términos profesionales siempre requieren revisión.

## Estructura

```text
src/
  App.tsx                 Rutas y navegación
  Wizard.tsx              Preguntas guiadas
  TemplatesPage.tsx        Catálogo de diseños
  Review.tsx              Revisión y descargas
  ResumePreview.tsx        Vista previa
  templates.ts            Los 17 diseños originales
  exports/                Generadores PDF y DOCX
  translation*.ts         Traducción local y worker
  locales/                Textos de los cuatro idiomas
  content.ts              Guías originales
  prerender.tsx           Páginas públicas y SEO de compilación
public/
  _headers                Cabeceras para Cloudflare Pages
  _redirects              Navegación de rutas en Cloudflare Pages
  robots.txt              Exclusión de las pantallas del editor
scripts/
  copy-onnx.mjs            Copia del runtime WebAssembly instalado
docs/                     Publicación y privacidad
```

## Publicación y monetización

El código permanece en GitHub y la web se prepara para Cloudflare Pages, con una dirección gratuita `*.pages.dev`. La disponibilidad del nombre `cvonline.pages.dev` no se ha comprobado. Un dominio propio puede conectarse después sin cambiar de repositorio.

**No se carga publicidad con la configuración predeterminada.** La integración prevista se limita a las páginas públicas. Activar el cargador de AdSense requiere la aprobación de Google, identificación del responsable y contacto, y la configuración de una plataforma de consentimiento certificada cuando corresponda. El cuadro de elección incluido en la interfaz no sustituye esa plataforma. No se garantiza aprobación ni ingresos con un subdominio o dominio propio.

## Derechos y dependencias

El código, diseños y contenido originales de CVonline tienen los derechos reservados indicados en [LICENSE](LICENSE). Esto no cambia las licencias de sus dependencias. React, los generadores de documentos, las fuentes, iconos, runtime y modelos mantienen sus licencias respectivas; consulta [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
