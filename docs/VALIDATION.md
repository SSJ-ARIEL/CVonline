# Validación de CVonline

Las comprobaciones se realizaron con Node.js 24, npm, Chromium y Poppler. La compilación utiliza el origen real asignado por Cloudflare: https://cvonline-zw0.pages.dev.

## Resultado

- Dependencias reutilizadas del entorno preparado con `ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm ci`; las dependencias y el archivo de bloqueo no cambiaron.
- `npm run build`: correcto, con TypeScript, 52 páginas públicas prerenderizadas, avisos de 140 dependencias y comprobación del límite de 25 MiB por archivo de Cloudflare Pages.
- `npm audit --omit=dev --audit-level=high`: cero vulnerabilidades conocidas reportadas.
- Suite de producción: **20 pruebas aprobadas, cero fallidas, cero omitidas, cero inestables**.
- Catálogo: 400 diseños y nombres únicos, 50 por cada uno de los ocho tipos. Cinco composiciones base y diez variantes estructurales por tipo; cada colección presentó 50 firmas geométricas distintas sin contar colores ni nombres.
- Vista previa: 400 renders normales y 80 casos extensos, con cuatro idiomas, seis fuentes, nombres largos, fotos y documentos de varias páginas; sin desbordamientos ni títulos ausentes.
- Interfaz: 48 casos de tipo, catálogo y revisión en cuatro idiomas y anchos de 320, 390, 768 y 1440 px; 96 selecciones de fuente y cero errores o desbordamientos.
- Exportaciones: 62 PDF y 62 Word, incluidos los ocho tipos, las seis fuentes, diez variantes y cuatro currículums extensos de 9–10 páginas. Se verificaron títulos, subtítulos, viñetas, textos y fotos.
- Tipografías: 12 TTF estáticos y 12 WOFF2, pesos 400/700, permiso de incrustación, caracteres acentuados y símbolo del euro, equivalencia de contornos y hashes del manifiesto.
- Configuración pública: 52 URL en el sitemap y enlaces canónicos con el dominio real; publicidad desactivada y sin identificadores de Google inventados.
- Verificación Google: 260 comprobaciones de HTML en cinco configuraciones temporales; metadatos de Search Console, meta AdSense y `ads.txt` independientes de la activación de anuncios. Los identificadores de prueba no entraron al despliegue.
- Runtime local: gzip de 3.695.787 bytes que recupera exactamente los 14.264.838 bytes originales, SHA-256 `06ba057753da3847e4c24f02d91ab133455b0817c69a44993a9a53a2146df9e3`. Siete escenarios de navegador aprobados, incluidos ambos tipos de hosting, rechazos de archivos inválidos y una inferencia CPU real mediante la API pública de Transformers.js con un modelo Identity. Cero peticiones externas y cero violaciones del CSP del editor.
- Galería HTML independiente: 18 capturas actuales de escritorio y móvil; todas las imágenes decodifican, funciona sin solicitudes HTTP y no desborda a 320 px.

## Cobertura del navegador

Las pruebas conservan los recorridos en español, inglés, italiano y portugués; validación de contacto y fechas; fotos PNG, JPEG y WebP procesadas localmente; navegación móvil; recarga y reinicio; ausencia de almacenamiento persistente y envío de datos personales; y exportación real de PDF y DOCX.

Las comprobaciones del catálogo cargan sus 400 diseños mediante paginación, revisan 50 por tipo y prueban búsquedas sin distinción de mayúsculas ni acentos. El recorrido obligatorio sigue idioma → tipo → diseño → perfil → preguntas → revisión.

La fuente seleccionada se conserva al cambiar de tipo o diseño y se aplica a texto, nombre y cabeceras. Poppler verifica las seis familias reales incrustadas en PDF y caracteres Unicode; el XML de Word declara la familia seleccionada en textos y estilos. Word puede sustituirla si no está instalada en el equipo del lector.

Cambiar entre los ocho tipos conserva respuestas, foto y fuente, modifica el orden real en vista previa, PDF y Word, y presenta las entradas actuales y recientes primero sin alterar el formulario. Una prueba extensa de Lato, Prism Contact, Carta y 13 pt verifica los títulos completos de siete experiencias y cuatro proyectos en el PDF de varias páginas.

## Traducción: límite pendiente

Se verificaron los tokenizadores reales, preparación de idiomas, ejecución CPU WebAssembly con un pequeño modelo ONNX oficial, cancelación y conservación de las respuestas originales ante errores de descarga. Las peticiones contienen nombres de modelos, sin texto del currículum.

**La inferencia completa de traducción no se ha verificado:** el CDN de los pesos devolvió HTTP 403 por restricciones de red. La ejecución del modelo ONNX pequeño no demuestra la ejecución completa ni la calidad del traductor Marian. La interfaz, preguntas, guías y títulos del documento sí se verificaron en los cuatro idiomas.

## Publicación

**Cloudflare confirmó el despliegue de producción el 11 de octubre de 2026** en https://cvonline-zw0.pages.dev. Identificador: `776dea4c-7145-46df-844a-2933342fc421`; estado de la etapa `deploy`: `success`; rama `main`; commit `e93bb80c5b7348d130b6b7e1d1df01a765fb7944`. URL individual: https://776dea4c.cvonline-zw0.pages.dev.

Wrangler cargó correctamente los 232 archivos estáticos, `_headers` y `_redirects`. El archivo grande que antes bloqueaba el transporte se distribuye ahora comprimido y se descomprime en memoria con las API oficiales. No se eliminaron funciones ni se deshabilitaron verificaciones de transporte o integridad.

La suite final `CI=true npm test -- --retries=0` completó **20 pruebas aprobadas, cero fallidas, omitidas o reintentadas**. Se corrigió una carrera en la prueba del catálogo: el conteo de guías ahora espera su renderizado después de navegar. La aplicación conserva sus seis guías por idioma.

Las peticiones HTTPS desde este entorno al dominio público devolvieron HTTP 403 y `error code: 1010`, incluso antes del despliegue. La API confirma la publicación, pero esta respuesta no permite dar por comprobado el acceso público desde un navegador externo. Las pruebas funcionales de producción se completaron en el entorno local.

**AdSense y Search Console no se han dado de alta ni verificado en una cuenta de Google.** El soporte técnico de los metadatos está listo, pero faltan los códigos reales, los datos públicos de contacto y el acceso a los paneles. La publicidad permanece desactivada. El dominio gratuito puede presentarse como sitio en AdSense porque `pages.dev` aparece en la Public Suffix List; la aprobación la decide Google.
