# Fondos de los diseños de CV

Cada uno de los ocho tipos conserva sus 50 diseños: 40 utilizan papel pastel y
10 mantienen el blanco clásico. En total hay 320 diseños pastel y 80 blancos.
La paleta incluye rosa, azul, lavanda, menta, crema, melocotón, gris azulado y
verde salvia. Los tonos son suaves para conservar una presentación profesional.

`TemplateDefinition.pageBackground` es la única fuente del color: se aplica a
la miniatura, la vista previa, todas las páginas PDF y el fondo del documento
Word. Word conserva el color como fondo nativo editable; su impresión depende
de las opciones de impresión del editor. El PDF incluye el fondo directamente.

Los 400 identificadores, nombres, acentos y propiedades geométricas coinciden
con el catálogo anterior. El color de tinta se oscurece cuando es necesario
para mantener contraste de al menos 4,5:1 sobre el papel elegido, incluidos
acentos personalizados blancos y neón. Los colores decorativos se conservan.

## Comprobaciones realizadas

- Compilación de producción aprobada: TypeScript, 52 páginas públicas, licencias
  y límite de tamaño de Cloudflare Pages.
- Catálogo completo: 40 pastel y 10 blancos por tipo, nueve colores de papel
  distintos por colección y contraste del texto contra su fondo real.
- PDF y Word: foto, Unicode, texto extenso y tamaño Carta conservados. El color
  rosa de Prism se comprobó rasterizando un píxel del margen de la primera y
  última página PDF; el XML de Word contiene el mismo fondo y la opción de
  visualización del color.
- Vista móvil de 390 px: flujo completo y catálogo sin desbordamiento horizontal.
- AdSense: fragmento público y entrada al editor con un documento limpio.
- 72 comprobaciones de contraste con ocho acentos y los nueve colores de papel.
- Comparación de huellas: código AdSense, HTML de verificación de Google,
  sitemap, robots, `ads.txt`, rutas y estilos generales idénticos a los anteriores.

Las cuatro pruebas funcionales seleccionadas tienen resultado final aprobado.
La prueba de contraste del catálogo se corrigió para resolver el fondo real de
paneles y cabeceras, y después pasó sin reintentos automáticos. No se repitió la
suite completa anterior para este cambio de fondos.

Las preferencias permanentes del propietario están documentadas en `AGENTS.md`.
