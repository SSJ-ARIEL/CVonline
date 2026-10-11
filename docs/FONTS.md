# Tipografías del currículum

En la página de resultado, el selector **Tipografía** ofrece la opción automática del diseño y seis familias profesionales. La selección se conserva al cambiar de plantilla o de tipo de CV durante la sesión.

| Familia | Estilo | Uso sugerido |
| --- | --- | --- |
| Inter | Sans serif contemporánea | CV técnico, cronológico y diseños de lectura directa. |
| Lato | Sans serif humanista | Trayectorias profesionales, servicios y documentos de tono cercano. |
| Montserrat | Sans serif geométrica | Perfiles creativos y composiciones con una cabecera marcada. |
| Source Sans 3 | Sans serif humanista | Documentos extensos, CV funcional y combinaciones de habilidades y experiencia. |
| Source Serif 4 | Serif editorial | CV académico, investigación y diseños de inspiración Harvard. |
| Merriweather | Serif de lectura | Perfiles formales y composiciones clásicas. |

Estas recomendaciones orientan la elección; cualquiera de las seis fuentes puede aplicarse a cualquier diseño. La opción automática mantiene DM Sans en los diseños sans serif y Georgia en los diseños serif de la vista previa. Los exportadores automáticos usan Helvetica o Times en PDF y Calibri o Cambria en Word.

## Vista previa y exportación

- **Navegador:** las fuentes se sirven como WOFF2 desde el propio sitio. La tipografía elegida se aplica al nombre, la cabecera, los títulos de sección y el texto.
- **PDF:** los archivos TrueType normal y negrita de la familia seleccionada se incrustan en el documento. El lector no necesita instalar la fuente para verla correctamente.
- **Word (.docx):** el documento declara la familia seleccionada. Las fuentes no se incrustan en Word; si esa fuente no está instalada en el equipo del lector, Word puede sustituirla. La interfaz informa de ello antes de descargar.

Los archivos cubren las letras acentuadas necesarias para español, inglés, italiano y portugués, además del símbolo del euro. Las fuentes no traducen el contenido: el idioma de las etiquetas y el contenido del CV se gestiona por separado.

## Archivos, licencias y comprobaciones

`src/fonts.ts` centraliza los identificadores, las familias CSS, las familias de PDF, los nombres de Word y las rutas. `src/fonts.css` declara dos pesos por familia: 400 y 700.

`public/fonts/` contiene 12 TTF para PDF y 12 WOFF2 para navegador, seis licencias completas y un [manifiesto de procedencia](../public/fonts/manifest.json). Las fuentes se alojan localmente y no requieren solicitudes a Google Fonts ni a otro proveedor externo.

La procedencia, las revisiones fijadas y el tratamiento de los nombres reservados están documentados en [LICENSES.md](../public/fonts/LICENSES.md). Lato, Source Sans 3, Source Serif 4 y Merriweather usan archivos estáticos oficiales sin modificar. Inter y Montserrat se instancian desde archivos variables oficiales; sus licencias permiten conservar esos nombres.

Se verificaron los 12 TTF: archivos estáticos, pesos 400/700 correctos, permiso de incrustación `OS/2.fsType = 0`, cobertura de caracteres acentuados y coincidencia de mapas de caracteres y contornos con sus WOFF2. Todos los hashes coinciden con el manifiesto. Los TTF suman 4.44 MB y los WOFF2 1.42 MB; el archivo mayor ocupa 656,568 bytes. Los archivos se solicitan según la fuente elegida y la operación de exportación.
