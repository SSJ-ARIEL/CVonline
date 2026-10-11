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
- Configuración pública: 52 URL en el sitemap y enlaces canónicos con el dominio real; publicidad desactivada y sin `ads.txt`.
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

El acceso a Cloudflare y la creación del proyecto Pages `cvonline` se verificaron mediante la API. **El sitio todavía no está publicado: el proyecto tiene cero despliegues.** El proxy del entorno rechazó la carga del archivo WASM con HTTP 401 y el mensaje de autenticación de la integración `codex-secret-api.cloudflare.com`. Dos lotes pequeños fueron aceptados; también falló el WASM aislado (14.26 MB original y aproximadamente 19.02 MB en base64). Una comprobación no mutante de transporte gzip devolvió HTTP 400. No se deshabilitaron comprobaciones ni se omitieron recursos del build.

La publicación requiere subir el ZIP completo desde el panel de Cloudflare siguiendo [las instrucciones](CLOUDFLARE.md#subir-el-zip-desde-el-panel). Las credenciales ya autenticaron operaciones; este bloqueo no justifica solicitar otro token. El acceso HTTPS al dominio desde el entorno también está restringido por el proxy. Tras el despliegue manual deben comprobarse el acceso público y los recursos en la dirección asignada.

El dominio independiente y la activación de AdSense quedan para una etapa posterior con los datos reales de la cuenta. No se solicitó ni se obtuvo aprobación de Google.
