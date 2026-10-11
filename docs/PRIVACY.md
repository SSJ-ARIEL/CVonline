# Tratamiento de datos de CVonline

Este documento describe el diseño técnico de la aplicación. Las páginas públicas de privacidad y condiciones están traducidas en `src/locales/`. El responsable del sitio debe completar su identidad y el canal de contacto real antes de publicar; la configuración predeterminada no inventa esos datos.

## Respuestas y fotografías

Los datos del currículum se mantienen en el estado de React y en la memoria de la pestaña. No se guardan en `localStorage`, `sessionStorage`, IndexedDB, cookies, una base de datos o un backend de CVonline. Tampoco se incluyen en parámetros de URL.

La fotografía se lee desde el archivo elegido por el usuario, se procesa en el navegador y se utiliza en la vista previa y los documentos. No se sube a un servidor. El acceso a cámara, micrófono y geolocalización no es necesario y las cabeceras de Pages lo restringen.

El usuario puede avanzar y volver mientras permanezca en la misma sesión. Recargar, cerrar la pestaña o empezar de nuevo elimina el estado de la aplicación. No existe una copia recuperable del trabajo. La advertencia de salida del navegador puede variar según el dispositivo y no constituye un sistema de guardado.

## Descargas

PDF y DOCX se generan en el navegador. El archivo se guarda únicamente donde el usuario decida descargarlo. CVonline no recibe ni conserva una copia.

El usuario controla los archivos descargados y su envío posterior. El nombre del documento y su contenido pueden contener datos personales porque forman parte del currículum; conviene revisar ambas cosas antes de compartirlo. Un documento Word puede reordenarse al abrirlo en otro programa y necesita revisión.

## Traducción

La aplicación no envía las respuestas a una API de traducción remota. Traduce los campos descriptivos y mantiene sin modificar los datos de contacto, los nombres de personas y organizaciones y los identificadores. Los resultados se aplican tras completar la operación; un fallo conserva las respuestas originales.

Hay dos implementaciones:

- **API nativa local de Google Chrome**, cuando ese navegador declara que la combinación de idiomas está disponible. Chrome administra sus propias descargas y recursos de traducción.
- **Respaldo en Web Worker**: Transformers.js ejecuta modelos Marian sobre WebAssembly. Se descargan modelos públicos de Hugging Face; las solicitudes no contienen el texto del currículum ni la fotografía. El worker utiliza solicitudes sin credenciales ni referente, evita cachés de la aplicación y se termina al completar o cancelar.

Los modelos de respaldo se descargan por HTTPS y sus revisiones están fijadas en el código. La aplicación desactiva su almacenamiento persistente y solicita `cache: no-store`; sus pesos solo se utilizan en memoria durante esa operación. Los recursos WebAssembly y fuentes son archivos públicos del propio alojamiento. La política de no guardar respuestas no significa que el navegador no administre los archivos públicos o las descargas que el usuario decide conservar.

Hugging Face y su CDN pueden procesar datos técnicos de conexión, como dirección IP y metadatos HTTP, al entregar los archivos públicos. Esto es distinto de recibir el contenido del CV. La descarga exige aproximadamente 108 MiB de pesos por dirección; las combinaciones entre español, italiano y portugués usan dos modelos, unos 216 MiB, además de archivos auxiliares.

La inferencia del respaldo no pudo completarse durante la validación en el entorno de desarrollo porque el CDN de los modelos devolvió HTTP 403. Debe comprobarse el acceso y rendimiento en navegadores de destino. Esa limitación no cambia la arquitectura de privacidad ni autoriza a enviar respuestas a otro proveedor.

## Alojamiento y registros técnicos

Cloudflare debe recibir solicitudes HTTP y puede tratar información de conexión para servir y proteger la web. CVonline no añade un endpoint para registrar currículums, telemetría de respuestas ni una herramienta de analítica del editor. El proveedor puede tener registros técnicos propios según sus servicios y condiciones.

Las cabeceras y `robots.txt` excluyen el editor de la indexación y utilizan `no-store` en las pantallas que contienen datos. Son medidas adicionales; la protección principal es que esos datos no se envían al alojamiento ni forman parte del HTML prerenderizado.

## Publicidad

Las páginas públicas incluyen en su cabecera el script de Google AdSense con el identificador real del propietario, `ca-pub-7507181626477156`, para la verificación de su cuenta. El navegador carga este código al abrir esas páginas, sin esperar al cuadro de preferencia de CVonline. Google puede recibir la dirección IP y metadatos de conexión, y utilizar cookies según la configuración de la cuenta y sus servicios.

`VITE_ADSENSE_READY=false` no impide esa carga inicial ni garantiza la ausencia de cookies o anuncios. La configuración de la cuenta de AdSense, incluidos los anuncios automáticos, puede determinar el comportamiento del script. El propietario debe gestionar la aprobación del sitio, las opciones publicitarias y el consentimiento exigido por Google y los mercados atendidos, incluida una CMP certificada cuando corresponda. El cuadro de elección de CVonline es una interfaz de preferencia, **no una plataforma de consentimiento certificada** ni una sustitución de la CMP.

El editor utiliza un documento inicial limpio, sin el script de AdSense ni código de publicidad. La entrada desde una página pública abre ese documento antes de solicitar los datos personales, para que el código cargado previamente no permanezca en el documento de edición. Las respuestas y la fotografía se mantienen en memoria y no se envían a AdSense.

La política pública debe describir los proveedores, finalidades, opciones y contacto reales de la integración que gestione el propietario. Las variables del responsable y contacto se incorporan al sitio de forma pública. Cualquier cambio en la cuenta publicitaria o en la CMP exige revisar tanto esta descripción como el comportamiento del despliegue.

## Verificación de privacidad

Al probar un despliegue:

1. Examina almacenamiento y cookies con las herramientas del navegador antes y después de llenar un CV. La aplicación no debe persistir respuestas o foto.
2. Revisa las solicitudes de red mientras introduces datos, subes una foto y exportas. No debe existir envío de ese contenido a servidores.
3. Con traducción, comprueba que las peticiones solo solicitan archivos públicos y no incorporan fragmentos del CV en URL, cuerpo o cabeceras.
4. Confirma que recargar elimina el borrador y que empezar de nuevo vacía los datos.
5. Comprueba la carga inicial de AdSense en páginas públicas y el tratamiento efectivo de cookies y consentimiento según la cuenta del propietario. Al entrar al editor desde una página pública, confirma que se abre un documento nuevo sin scripts, solicitudes ni código publicitario, y que ningún dato del CV se incorpora a solicitudes externas.

Estas comprobaciones deben repetirse cuando se añadan proveedores, seguimiento, almacenamiento o servicios que puedan modificar el flujo de datos. Mantén los logs de desarrollo libres de respuestas, fotografías y errores que incluyan fragmentos del currículum.
