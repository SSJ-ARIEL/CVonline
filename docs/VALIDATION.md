# Validación de la primera versión

La versión se comprobó en el entorno de desarrollo de Codex con Node.js 24, npm y Chromium. Estas comprobaciones describen el entorno actual; no acreditan todavía un despliegue público ni la ejecución de GitHub Actions.

## Resultado

- Instalación repetible con `ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm ci`: correcta.
- `npm run build`: correcto, con TypeScript, 52 páginas públicas prerenderizadas, avisos de licencias y comprobación del límite de 25 MiB por archivo de Cloudflare Pages.
- `npm audit --omit=dev --audit-level=high`: cero vulnerabilidades conocidas reportadas.
- Arranque de desarrollo: portada y selector de cuatro idiomas comprobados en Chromium.
- `npm test` sobre la compilación de producción: **13 pruebas aprobadas, cero fallidas, cero omitidas, cero inestables**.
- Revisión visual: 64 combinaciones de idioma, tamaño de pantalla y página pública sin desbordamiento horizontal.
- Configuración de producción probada en un directorio temporal: lectura de `.env.local`, 52 URL del sitemap, alternativas de cuatro idiomas, exclusión del editor y generación condicional de `ads.txt`. Los datos ficticios de esta comprobación no se incluyen en el build publicado.

## Cobertura del navegador

Las pruebas cubren los recorridos en español, inglés, italiano y portugués; contacto y fechas inválidos; fotos PNG, JPEG y WebP procesadas localmente; 17 diseños y sus filtros; navegación móvil; recarga y reinicio; ausencia de almacenamiento persistente y envío de datos personales; y exportación real de PDF y DOCX.

Los documentos se inspeccionan con Poppler y mediante lectura de los archivos XML del DOCX. Se verifican caracteres acentuados, fotografía, texto largo completo, PDF de varias páginas, papel Carta, diseños de una y dos columnas y contenido editable de Word. También se comprueba que continuar conserve los borradores de habilidades e intereses y que las secciones personalizadas incompletas soliciten el campo que falta.

## Traducción: límite pendiente

Se verificaron los tokenizadores reales de los idiomas admitidos, la preparación de los identificadores de destino, la ejecución CPU WebAssembly con un pequeño modelo ONNX oficial, la cancelación y la conservación de las respuestas originales ante un error de descarga. Las peticiones observadas contienen nombres de modelos, sin el texto del currículum.

**La inferencia completa de traducción no se ha verificado:** el CDN de los pesos devolvió HTTP 403 por restricciones de red del entorno. Ejecutar un modelo ONNX pequeño demuestra que el runtime funciona, pero no demuestra la calidad ni la ejecución completa del traductor Marian. Es necesario probar esa función con acceso a los archivos de modelos y en dispositivos de destino.

Cloudflare Pages, el dominio y la activación efectiva de AdSense se revisarán después de configurar las cuentas y los datos reales de producción.
