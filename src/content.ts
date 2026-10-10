import type { Locale } from './model';

export type Guide = {
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
};

const guides: Record<Locale, Guide[]> = {
  es: [
    {
      slug: 'first-cv',
      title: 'Tu primer currículum, con experiencia que ya tienes',
      description: 'Convierte estudios, proyectos y actividades en información útil para tu primera candidatura.',
      readingTime: '3 min',
      sections: [
        { title: 'Empieza por un objetivo concreto', paragraphs: ['Antes de escribir, elige el tipo de puesto al que quieres presentar tu candidatura. Lee varias ofertas y anota las tareas, herramientas y conocimientos que se repiten. Tu currículum debe ayudar a entender qué puedes aportar a ese trabajo, aunque todavía no tengas un empleo formal.'] },
        { title: 'Busca experiencia más allá del empleo', paragraphs: ['Los proyectos de clase, las prácticas, el voluntariado y la colaboración en un negocio familiar pueden demostrar habilidades. Describe el contexto y tu participación real. No conviertas una actividad ocasional en un cargo que no ocupaste.'], bullets: ['Indica el nombre del proyecto o la organización y las fechas.', 'Explica qué hiciste tú, qué herramientas usaste y qué entregaste.', 'Incluye un enlace a una muestra de trabajo si es pública y relevante.'] },
        { title: 'Escribe con ejemplos, no con adjetivos', paragraphs: ['“Responsable y proactivo” dice poco sin evidencia. Es más útil explicar una tarea concreta. Ejemplo ficticio: “Organicé el calendario de un proyecto de clase y preparé la presentación final con un equipo de cuatro estudiantes”. Utiliza este ejemplo como estructura, nunca como experiencia propia.'] },
        { title: 'Organiza y revisa', paragraphs: ['Coloca formación o proyectos primero si son tu evidencia más sólida. Incluye datos de contacto vigentes, habilidades que puedas demostrar e idiomas con un nivel honesto. Una página suele ser suficiente al comienzo, pero la claridad importa más que una longitud fija.', 'Revisa fechas, ortografía, enlaces y el archivo exportado. Pide a otra persona que identifique rápidamente tu objetivo y dos capacidades relevantes; si no puede hacerlo, simplifica el contenido.'] },
      ],
    },
    {
      slug: 'achievements',
      title: 'Cómo contar logros sin inventar cifras',
      description: 'Explica el valor de tu trabajo con acciones, contexto y resultados que puedas defender.',
      readingTime: '3 min',
      sections: [
        { title: 'Distingue una función de una aportación', paragraphs: ['Una función explica qué estaba a tu cargo; una aportación muestra qué hiciste o mejoraste. Ambas pueden ser útiles. Para encontrar logros, recuerda problemas que resolviste, procesos que organizaste, entregas que completaste o conocimientos que compartiste. No todo resultado necesita un porcentaje.'] },
        { title: 'Usa acción, contexto y resultado', paragraphs: ['Empieza con un verbo concreto, añade el contexto necesario y termina con el resultado observado. Ejemplo ficticio: “Organicé las consultas frecuentes en una guía interna que el equipo utilizó para responder casos repetidos”. La frase identifica una acción y un uso verificable sin fabricar una mejora numérica.'], bullets: ['Qué hiciste: preparé, coordiné, analicé, diseñé o resolví.', 'Dónde y con qué: proceso, equipo, herramientas o alcance.', 'Qué ocurrió: entrega completada, problema resuelto o cambio documentado.'] },
        { title: 'Añade cifras solo si tienes respaldo', paragraphs: ['Utiliza cantidades que recuerdes con precisión o puedas comprobar en registros autorizados. Explica a qué periodo corresponden y qué parte del resultado dependió de ti. Si el trabajo fue colectivo, utiliza expresiones como “contribuí” o “junto con el equipo”.', 'Si no tienes datos fiables, cuenta el resultado cualitativo. No calcules porcentajes a partir de una impresión ni incluyas información confidencial de clientes o empleadores.'] },
        { title: 'Selecciona lo que importa al puesto', paragraphs: ['Elige dos o tres aportaciones relevantes por experiencia en lugar de listar todas tus tareas. Evita repetir el mismo logro en el resumen y en cada sección. Lee las frases en voz alta y comprueba que podrías explicar el contexto en una entrevista sin exagerar tu responsabilidad.'] },
      ],
    },
    {
      slug: 'ats',
      title: 'Un currículum claro para personas y sistemas ATS',
      description: 'Reduce problemas de lectura automática sin sacrificar precisión ni prometer resultados.',
      readingTime: '3 min',
      sections: [
        { title: 'Qué puede hacer un ATS', paragraphs: ['Un sistema de seguimiento de candidaturas puede almacenar solicitudes, extraer información y facilitar búsquedas. Su funcionamiento depende de la plataforma y de la configuración de cada empleador. Ninguna plantilla garantiza superar un filtro ni conseguir una entrevista. La prioridad es presentar información comprensible y relevante.'] },
        { title: 'Elige una estructura sencilla', paragraphs: ['Para candidaturas que pasan por un formulario, un diseño de una columna suele facilitar un orden de lectura claro. Usa títulos habituales como Experiencia, Formación y Habilidades. Escribe tu correo y teléfono como texto; no dependas únicamente de iconos.'], bullets: ['Mantén fechas y nombres de puestos con un formato coherente.', 'Evita convertir todo el documento en una imagen.', 'Comprueba que el texto del PDF se puede seleccionar y copiar.', 'Coloca información importante en el cuerpo del documento.'] },
        { title: 'Adapta el vocabulario con honestidad', paragraphs: ['Lee la oferta y utiliza sus términos cuando describan tu experiencia real. Si pide una herramienta que dominas, nómbrala de forma explícita. No añadas habilidades que no tienes, listas de palabras escondidas ni repeticiones artificiales. El documento también debe tener sentido para quien lo lea.'] },
        { title: 'Verifica la extracción y las instrucciones', paragraphs: ['Copia el contenido del PDF en un editor de texto y revisa el orden de las secciones. Este control detecta algunos problemas, pero no reproduce todos los sistemas ATS. Si el formulario extrae tus datos, compruébalos antes de enviar.', 'Respeta el formato solicitado por la empresa. Si pide Word, entrega Word y revisa sus páginas; si permite PDF, usa un archivo con texto legible y un nombre claro.'] },
      ],
    },
    {
      slug: 'photo',
      title: '¿Conviene poner una foto en el currículum?',
      description: 'Decide según el destino de la candidatura y prepara una imagen adecuada si la necesitas.',
      readingTime: '3 min',
      sections: [
        { title: 'La foto es opcional', paragraphs: ['No existe una regla universal. Las prácticas cambian según el país, el sector y la organización. En algunos procesos se espera una foto; en otros se prefiere evitarla para reducir información personal innecesaria. Revisa las instrucciones de la oferta y las prácticas del mercado al que te diriges.'] },
        { title: 'Decide qué aporta a tu candidatura', paragraphs: ['La experiencia, las habilidades y la formación deben seguir siendo el centro del documento. Una foto no demuestra capacidad profesional. Si la oferta no la solicita y no tienes una razón clara para incluirla, puedes elegir una plantilla sin foto. Nunca incluyas una imagen que no sea tuya ni una representación que cambie tu identidad.'] },
        { title: 'Prepara una imagen sencilla', paragraphs: ['Si decides añadirla, utiliza una fotografía reciente con luz uniforme y fondo limpio. Elige un encuadre de rostro y hombros, con una expresión natural. La ropa puede reflejar el contexto laboral sin convertirse en un requisito rígido.'], bullets: ['Evita filtros intensos, recortes de grupo y fondos distraídos.', 'Revisa que el rostro no quede cortado en la vista previa.', 'Comprueba nitidez y tamaño en el PDF y en Word.', 'Usa solo imágenes que tengas derecho a utilizar.'] },
        { title: 'Cuida la privacidad y la revisión final', paragraphs: ['En CVonline la foto y los datos del CV se trabajan en la memoria de la pestaña. Recargar o cerrar elimina el trabajo; descarga el resultado antes de salir.', 'Antes de enviarlo, revisa que la foto no tape texto ni desplace una sección importante. Puedes comparar las versiones con y sin foto y elegir la más apropiada para esa candidatura.'] },
      ],
    },
    {
      slug: 'pdf-word',
      title: 'PDF o Word: elige y revisa tu archivo',
      description: 'Conoce qué conservar y qué comprobar antes de compartir cada formato.',
      readingTime: '3 min',
      sections: [
        { title: 'Sigue primero las instrucciones de la oferta', paragraphs: ['El formato solicitado por la empresa tiene prioridad sobre cualquier preferencia personal. Comprueba la extensión permitida y el tamaño máximo del archivo. Si no hay indicaciones, un PDF suele ser útil para compartir una presentación estable; Word permite editar el contenido con mayor facilidad.'] },
        { title: 'Qué comprobar en un PDF', paragraphs: ['Abre el archivo descargado y revisa todas las páginas, no solo la vista previa del editor. El texto debe verse nítido, poder seleccionarse y conservar un orden razonable al copiarlo. Una captura o un escaneo de la página no ofrece las mismas posibilidades de lectura.'], bullets: ['Busca cortes de líneas, secciones o fotografías.', 'Comprueba correo, teléfono, enlaces y caracteres especiales.', 'Revisa que no queden páginas vacías al final.', 'Asegúrate de que el texto tenga contraste suficiente.'] },
        { title: 'Qué comprobar en Word', paragraphs: ['La paginación puede cambiar entre Word, LibreOffice y otros editores por las fuentes y las reglas de distribución. Abre el DOCX en el programa con el que vas a editarlo y comprueba márgenes, saltos de página, listas y fotos. Usa fuentes comunes si necesitas compartir un archivo editable.', 'Después de modificar el documento, vuelve a revisarlo. No asumas que se mantiene idéntico al PDF generado anteriormente.'] },
        { title: 'Prepara el envío', paragraphs: ['Utiliza un nombre reconocible, por ejemplo Nombre_Apellido_CV, y añade idioma o puesto si gestionas varias versiones. Evita incluir datos sensibles en el nombre del archivo. Conserva la versión que enviaste para preparar la entrevista y actualiza ambos formatos cuando cambies el contenido.'] },
      ],
    },
    {
      slug: 'languages',
      title: 'Prepara un currículum en otro idioma',
      description: 'Adapta el documento al destinatario y revisa matices que una traducción puede perder.',
      readingTime: '3 min',
      sections: [
        { title: 'Elige el idioma de la candidatura', paragraphs: ['La oferta suele indicar el idioma esperado. Si está escrita en inglés y el proceso es internacional, puede ser razonable presentar el CV en inglés, pero verifica las instrucciones. Mantén títulos, fechas y descripciones en un mismo idioma para que el documento sea coherente.'] },
        { title: 'Traduce el sentido y conserva los nombres', paragraphs: ['Una traducción útil debe mantener el significado de tu experiencia. Los nombres de empresas, herramientas y marcas normalmente se conservan. Un cargo puede necesitar una explicación breve si no tiene equivalente directo. No transformes una titulación en una credencial extranjera que no posees.'], bullets: ['Comprueba títulos profesionales y términos del sector.', 'Explica siglas locales si el destinatario puede desconocerlas.', 'Mantén nombres oficiales de certificaciones cuando corresponda.', 'Revisa cifras, unidades, fechas y nombres propios.'] },
        { title: 'Revisa cualquier ayuda automática', paragraphs: ['La traducción automática puede interpretar mal una responsabilidad, un nivel de experiencia o una expresión local. Lee cada sección y, cuando sea posible, pide revisión a una persona que conozca el idioma y tu sector. Debes poder explicar en una entrevista lo que dice el CV.', 'Un texto gramaticalmente correcto también puede sonar poco natural. Prefiere frases directas y vocabulario profesional habitual antes que traducciones literales.'] },
        { title: 'Declara tus idiomas con precisión', paragraphs: ['Distingue el idioma del documento de tu capacidad para trabajar en él. Describe tu nivel de forma honesta y añade una certificación solo si la tienes. Si utilizas una escala como A1–C2, comprueba qué significa cada nivel; no asignes uno únicamente porque hayas traducido el CV.', 'Revisa la versión exportada completa, incluidos encabezados y formatos de fecha, antes de enviarla.'] },
      ],
    },
  ],
  en: [
    {
      slug: 'first-cv',
      title: 'Your first résumé starts with experience you already have',
      description: 'Turn education, projects and activities into useful evidence for your first application.',
      readingTime: '3 min',
      sections: [
        { title: 'Start with a specific direction', paragraphs: ['Choose the kind of role you want to apply for before you start writing. Read several job descriptions and note recurring tasks, tools and skills. Your résumé should make it easy to understand what you could contribute to that work, even if you have not held a formal job yet.'] },
        { title: 'Look beyond paid employment', paragraphs: ['Class projects, internships, volunteering and helping in a family business can show useful abilities. Explain the context and your actual contribution. Do not turn an occasional activity into a position you never held.'], bullets: ['Include the project or organisation name and dates.', 'Describe your own tasks, the tools you used and what you delivered.', 'Link to a relevant, publicly available work sample when appropriate.'] },
        { title: 'Use evidence instead of adjectives', paragraphs: ['“Responsible and proactive” is difficult to assess without an example. A concrete task is more useful. Fictional example: “Organised the schedule for a class project and prepared the final presentation with a team of four students.” Use this sentence as a structure, not as a claim about your own experience.'] },
        { title: 'Organise and check', paragraphs: ['Put education or projects first when they provide your strongest evidence. Include current contact details, skills you can demonstrate and honest language levels. One page is often enough at this stage, but clarity matters more than a fixed length.', 'Check dates, spelling, links and the exported file. Ask someone to identify your target role and two relevant abilities quickly. If they cannot, simplify the content.'] },
      ],
    },
    {
      slug: 'achievements',
      title: 'Describe achievements without inventing numbers',
      description: 'Show the value of your work through actions, context and outcomes you can explain.',
      readingTime: '3 min',
      sections: [
        { title: 'Separate responsibilities from contributions', paragraphs: ['A responsibility explains what you were expected to do; a contribution shows something you completed or improved. Both can be relevant. Look for problems you solved, processes you organised, work you delivered or knowledge you shared. A meaningful outcome does not always need a percentage.'] },
        { title: 'Use action, context and outcome', paragraphs: ['Begin with a specific verb, add enough context and finish with the observed outcome. Fictional example: “Organised common enquiries into an internal guide that the team used to answer recurring questions.” This describes an action and a verifiable use without inventing a numerical improvement.'], bullets: ['Action: prepared, coordinated, analysed, designed or resolved.', 'Context: process, team, tools or scope.', 'Outcome: a completed delivery, resolved issue or documented change.'] },
        { title: 'Use numbers only when you can support them', paragraphs: ['Choose figures you remember accurately or can verify in records you are authorised to use. Explain the relevant period and your part in the result. For team achievements, use wording such as “contributed to” or “worked with the team”.', 'Without reliable data, describe a qualitative outcome. Do not turn a general impression into a percentage or disclose confidential information about clients or employers.'] },
        { title: 'Select what matters for the role', paragraphs: ['Choose two or three relevant contributions for each position rather than listing every task. Avoid repeating an identical achievement throughout the document. Read your statements aloud and check that you could explain the context in an interview without overstating your responsibility.'] },
      ],
    },
    {
      slug: 'ats',
      title: 'Make your résumé clear for people and ATS software',
      description: 'Reduce extraction problems while keeping your application accurate and readable.',
      readingTime: '3 min',
      sections: [
        { title: 'Understand what an ATS may do', paragraphs: ['An applicant tracking system may store applications, extract information and support searches. Its behaviour depends on the platform and each employer’s configuration. No template guarantees passing a filter or receiving an interview. Clear, relevant information should remain your priority.'] },
        { title: 'Choose a straightforward structure', paragraphs: ['For applications submitted through a form, a single column often supports a clear reading order. Use familiar headings such as Experience, Education and Skills. Write your email address and phone number as text rather than relying on icons alone.'], bullets: ['Keep dates and job titles consistent.', 'Avoid turning the whole document into an image.', 'Check that PDF text can be selected and copied.', 'Put essential information in the main body of the document.'] },
        { title: 'Match terminology honestly', paragraphs: ['Read the job description and use its terms when they accurately describe your experience. If you know a requested tool, name it explicitly. Do not add skills you lack, hidden keyword lists or unnatural repetitions. A person reviewing the document should still find it meaningful.'] },
        { title: 'Check extraction and follow instructions', paragraphs: ['Copy your PDF text into a plain text editor and inspect the section order. This can reveal some issues, but it does not reproduce every ATS. If the application form extracts your details, review them before submitting.', 'Use the format the employer requests. If Word is required, submit Word and check its pagination. If PDF is accepted, use a file with readable text and a clear filename.'] },
      ],
    },
    {
      slug: 'photo',
      title: 'Should you include a photo on your résumé?',
      description: 'Consider the application’s destination and prepare a suitable image if one is needed.',
      readingTime: '3 min',
      sections: [
        { title: 'A photo is optional', paragraphs: ['There is no universal rule. Practices vary by country, industry and organisation. Some hiring processes expect a photo; others prefer to avoid unnecessary personal information. Check the job instructions and conventions in the market you are applying to.'] },
        { title: 'Consider what it adds', paragraphs: ['Your experience, skills and education should remain the focus. A photograph is not evidence of professional ability. If it is not requested and you have no clear reason to include one, choose a layout without a photo. Never use another person’s image or a representation that changes your identity.'] },
        { title: 'Prepare a simple image', paragraphs: ['If you include a photo, use a recent image with even lighting and a clean background. A face-and-shoulders crop and a natural expression usually work well. Clothing can reflect the work context without becoming a rigid requirement.'], bullets: ['Avoid heavy filters, group-photo crops and distracting backgrounds.', 'Check that the preview does not cut off your face.', 'Review sharpness and size in both PDF and Word.', 'Only use images you have the right to use.'] },
        { title: 'Protect privacy and review the final document', paragraphs: ['CVonline keeps your photo and résumé data in the tab’s memory. Reloading or closing the tab removes your work, so download the result before leaving.', 'Check that the photo does not cover text or push an important section onto another page. Compare versions with and without a photo and select the one best suited to the application.'] },
      ],
    },
    {
      slug: 'pdf-word',
      title: 'PDF or Word: choose and check your file',
      description: 'Understand what each format offers and what to review before sharing it.',
      readingTime: '3 min',
      sections: [
        { title: 'Follow the employer’s instructions first', paragraphs: ['The requested format takes priority over a personal preference. Check accepted extensions and the maximum file size. With no specific instructions, PDF is often useful for sharing a stable presentation, while Word makes further editing easier.'] },
        { title: 'What to check in a PDF', paragraphs: ['Open the downloaded file and inspect every page, not just the editor preview. Text should be sharp, selectable and reasonably ordered when copied. A screenshot or scanned page does not provide the same reading options.'], bullets: ['Look for clipped lines, sections or photos.', 'Check contact details, links and special characters.', 'Remove unintended blank pages at the end.', 'Make sure text has sufficient contrast.'] },
        { title: 'What to check in Word', paragraphs: ['Pagination can differ between Word, LibreOffice and other editors because of fonts and layout rules. Open the DOCX in the program you plan to use and inspect margins, page breaks, lists and photos. Common fonts can make an editable file easier to share.', 'After changing the document, check it again. Do not assume it will remain identical to a previously generated PDF.'] },
        { title: 'Prepare your submission', paragraphs: ['Choose a recognisable filename such as Firstname_Lastname_CV and add a language or role if you manage several versions. Avoid sensitive details in the filename. Keep the version you submitted to prepare for an interview, and update both formats whenever the content changes.'] },
      ],
    },
    {
      slug: 'languages',
      title: 'Prepare a résumé in another language',
      description: 'Adapt your document for its audience and check nuances a translation may miss.',
      readingTime: '3 min',
      sections: [
        { title: 'Choose the application language', paragraphs: ['A job posting often indicates the expected language. An English-language international process may call for an English résumé, but always check the instructions. Keep headings, dates and descriptions in a consistent language throughout the document.'] },
        { title: 'Translate meaning and preserve names', paragraphs: ['A useful translation preserves the meaning of your experience. Company, tool and brand names usually stay unchanged. A job title may need a brief explanation if there is no direct equivalent. Do not convert a qualification into a foreign credential you do not hold.'], bullets: ['Check job titles and industry terminology.', 'Explain local abbreviations the reader may not recognise.', 'Keep official certification names where appropriate.', 'Review numbers, units, dates and proper names.'] },
        { title: 'Review automated assistance', paragraphs: ['Machine translation may misinterpret a responsibility, experience level or local expression. Read every section and, when possible, ask someone familiar with both the language and your industry to review it. You should be able to explain your résumé in an interview.', 'Grammatically correct text can still sound unnatural. Prefer direct sentences and familiar professional vocabulary over literal translations.'] },
        { title: 'Describe your language skills accurately', paragraphs: ['The language of your document is separate from your ability to work in that language. State your level honestly and only list certifications you hold. If you use a scale such as A1–C2, check what the levels mean rather than assigning one because you translated your résumé.', 'Review the complete exported version, including headings and date formats, before sending it.'] },
      ],
    },
  ],
  it: [
    {
      slug: 'first-cv',
      title: 'Il tuo primo curriculum parte dalle esperienze che hai già',
      description: 'Valorizza studi, progetti e attività per preparare la tua prima candidatura.',
      readingTime: '3 min',
      sections: [
        { title: 'Parti da un obiettivo preciso', paragraphs: ['Prima di scrivere, scegli il tipo di posizione per cui vuoi candidarti. Leggi diversi annunci e annota le attività, gli strumenti e le competenze ricorrenti. Il curriculum deve far capire quale contributo potresti offrire, anche se non hai ancora avuto un impiego formale.'] },
        { title: 'Cerca esperienze oltre il lavoro retribuito', paragraphs: ['Progetti scolastici, tirocini, volontariato e collaborazioni in un’attività di famiglia possono dimostrare capacità utili. Descrivi il contesto e il tuo contributo effettivo. Non trasformare un’attività occasionale in un ruolo che non hai ricoperto.'], bullets: ['Indica il nome del progetto o dell’organizzazione e le date.', 'Spiega cosa hai fatto tu, quali strumenti hai usato e cosa hai consegnato.', 'Aggiungi un collegamento a un lavoro pubblico e pertinente, se disponibile.'] },
        { title: 'Usa esempi al posto degli aggettivi', paragraphs: ['“Responsabile e proattivo” comunica poco senza un riscontro. È più utile descrivere un’attività concreta. Esempio fittizio: “Ho organizzato il calendario di un progetto scolastico e preparato la presentazione finale con un gruppo di quattro studenti”. Usa questa frase come struttura, non come esperienza personale.'] },
        { title: 'Organizza e controlla', paragraphs: ['Metti prima formazione o progetti se sono le tue prove più solide. Inserisci contatti aggiornati, competenze dimostrabili e livelli linguistici sinceri. Una pagina spesso basta all’inizio, ma la chiarezza conta più di una lunghezza prestabilita.', 'Controlla date, ortografia, collegamenti e file esportato. Chiedi a una persona di individuare rapidamente il tuo obiettivo e due capacità pertinenti: se fatica, semplifica il contenuto.'] },
      ],
    },
    {
      slug: 'achievements',
      title: 'Racconta i risultati senza inventare numeri',
      description: 'Mostra il valore del tuo lavoro con azioni, contesto e risultati che puoi spiegare.',
      readingTime: '3 min',
      sections: [
        { title: 'Distingui mansioni e contributi', paragraphs: ['Una mansione descrive ciò di cui eri responsabile; un contributo mostra cosa hai realizzato o migliorato. Entrambi possono essere utili. Ripensa ai problemi risolti, ai processi organizzati, alle consegne completate e alle conoscenze condivise. Non ogni risultato richiede una percentuale.'] },
        { title: 'Usa azione, contesto e risultato', paragraphs: ['Inizia con un verbo preciso, aggiungi il contesto necessario e termina con un risultato osservabile. Esempio fittizio: “Ho raccolto le richieste frequenti in una guida interna che il gruppo ha utilizzato per rispondere ai casi ricorrenti”. La frase presenta un’azione e un utilizzo verificabile senza inventare un miglioramento numerico.'], bullets: ['Azione: preparare, coordinare, analizzare, progettare o risolvere.', 'Contesto: processo, gruppo, strumenti o ambito.', 'Risultato: consegna completata, problema risolto o cambiamento documentato.'] },
        { title: 'Inserisci cifre solo se verificabili', paragraphs: ['Usa quantità che ricordi con precisione o puoi verificare in documenti che sei autorizzato a consultare. Specifica il periodo e il tuo contributo al risultato. Per un lavoro collettivo, usa espressioni come “ho contribuito” o “insieme al gruppo”.', 'Senza dati affidabili, descrivi un risultato qualitativo. Non ricavare percentuali da un’impressione e non divulgare informazioni riservate su clienti o datori di lavoro.'] },
        { title: 'Seleziona ciò che serve alla candidatura', paragraphs: ['Scegli due o tre contributi pertinenti per ogni esperienza, invece di elencare tutte le attività. Evita di ripetere lo stesso risultato in ogni sezione. Leggi le frasi ad alta voce e verifica di poter spiegare il contesto in un colloquio senza esagerare le tue responsabilità.'] },
      ],
    },
    {
      slug: 'ats',
      title: 'Un curriculum chiaro per persone e sistemi ATS',
      description: 'Riduci i problemi di lettura automatica mantenendo una candidatura precisa e leggibile.',
      readingTime: '3 min',
      sections: [
        { title: 'Cosa può fare un ATS', paragraphs: ['Un sistema di gestione delle candidature può archiviare domande, estrarre informazioni e facilitare ricerche. Il funzionamento dipende dalla piattaforma e dalla configurazione dell’azienda. Nessun modello garantisce di superare un filtro o ottenere un colloquio. La priorità resta presentare informazioni comprensibili e pertinenti.'] },
        { title: 'Scegli una struttura semplice', paragraphs: ['Per candidature inviate tramite un modulo, una sola colonna spesso rende più chiaro l’ordine di lettura. Usa titoli comuni come Esperienza, Formazione e Competenze. Scrivi email e telefono come testo, senza affidarti soltanto alle icone.'], bullets: ['Mantieni coerenti date e nomi dei ruoli.', 'Non trasformare tutto il documento in un’immagine.', 'Controlla che il testo del PDF sia selezionabile e copiabile.', 'Inserisci le informazioni essenziali nel corpo del documento.'] },
        { title: 'Adatta il vocabolario con sincerità', paragraphs: ['Leggi l’annuncio e usa i suoi termini quando descrivono la tua esperienza reale. Se conosci uno strumento richiesto, nominalo esplicitamente. Non aggiungere competenze che non possiedi, parole chiave nascoste o ripetizioni artificiali. Il documento deve risultare sensato anche a chi lo legge.'] },
        { title: 'Controlla l’estrazione e le istruzioni', paragraphs: ['Copia il contenuto del PDF in un editor di testo e controlla l’ordine delle sezioni. Questa verifica individua alcuni problemi, ma non riproduce tutti i sistemi ATS. Se il modulo estrae i tuoi dati, ricontrollali prima dell’invio.', 'Rispetta il formato richiesto dall’azienda. Se chiede Word, invia Word e controlla l’impaginazione; se accetta PDF, scegli un file con testo leggibile e un nome chiaro.'] },
      ],
    },
    {
      slug: 'photo',
      title: 'È meglio inserire una foto nel curriculum?',
      description: 'Valuta il contesto della candidatura e prepara un’immagine adatta se ti serve.',
      readingTime: '3 min',
      sections: [
        { title: 'La foto è facoltativa', paragraphs: ['Non esiste una regola universale. Le abitudini cambiano in base al Paese, al settore e all’organizzazione. Alcuni processi prevedono una foto; altri preferiscono evitare dati personali non necessari. Controlla le indicazioni dell’annuncio e le consuetudini del mercato a cui ti rivolgi.'] },
        { title: 'Valuta il suo contributo', paragraphs: ['Esperienze, competenze e formazione devono rimanere al centro del documento. Una fotografia non dimostra capacità professionali. Se non viene richiesta e non hai un motivo preciso per inserirla, puoi scegliere un modello senza foto. Non usare immagini di altre persone o rappresentazioni che cambino la tua identità.'] },
        { title: 'Prepara un’immagine semplice', paragraphs: ['Se decidi di aggiungerla, usa una fotografia recente, con luce uniforme e sfondo pulito. Scegli un’inquadratura di viso e spalle e un’espressione naturale. L’abbigliamento può riflettere il contesto lavorativo senza diventare una regola rigida.'], bullets: ['Evita filtri intensi, ritagli di foto di gruppo e sfondi distraenti.', 'Controlla che il viso non sia tagliato nell’anteprima.', 'Verifica nitidezza e dimensioni in PDF e Word.', 'Usa soltanto immagini che hai diritto di utilizzare.'] },
        { title: 'Tutela la privacy e controlla il risultato', paragraphs: ['CVonline gestisce la foto e i dati del curriculum nella memoria della scheda. Ricaricare o chiudere la scheda elimina il lavoro: scarica il risultato prima di uscire.', 'Verifica che la foto non copra testo e non sposti una sezione importante su un’altra pagina. Confronta le versioni con e senza foto e scegli quella più adatta alla candidatura.'] },
      ],
    },
    {
      slug: 'pdf-word',
      title: 'PDF o Word: scegli e controlla il file',
      description: 'Scopri cosa offre ogni formato e cosa verificare prima di condividerlo.',
      readingTime: '3 min',
      sections: [
        { title: 'Segui prima le istruzioni dell’annuncio', paragraphs: ['Il formato richiesto dall’azienda viene prima delle preferenze personali. Verifica le estensioni ammesse e la dimensione massima del file. In assenza di indicazioni, il PDF è spesso utile per condividere un’impaginazione stabile; Word permette di modificare più facilmente il contenuto.'] },
        { title: 'Cosa controllare nel PDF', paragraphs: ['Apri il file scaricato e controlla tutte le pagine, non solo l’anteprima dell’editor. Il testo deve essere nitido, selezionabile e mantenere un ordine ragionevole quando viene copiato. Una schermata o una scansione non offre le stesse possibilità di lettura.'], bullets: ['Cerca righe, sezioni o foto tagliate.', 'Controlla contatti, collegamenti e caratteri speciali.', 'Verifica che non ci siano pagine vuote finali.', 'Assicurati che il testo abbia un contrasto sufficiente.'] },
        { title: 'Cosa controllare in Word', paragraphs: ['L’impaginazione può variare tra Word, LibreOffice e altri editor a causa dei caratteri e delle regole di distribuzione. Apri il DOCX nel programma che userai e verifica margini, interruzioni di pagina, elenchi e foto. I caratteri comuni facilitano la condivisione di un file modificabile.', 'Dopo ogni modifica, controlla di nuovo il documento. Non presumere che rimanga identico al PDF generato in precedenza.'] },
        { title: 'Prepara l’invio', paragraphs: ['Scegli un nome riconoscibile, come Nome_Cognome_CV, e aggiungi lingua o posizione se gestisci più versioni. Evita dati sensibili nel nome del file. Conserva la versione inviata per prepararti al colloquio e aggiorna entrambi i formati quando cambi il contenuto.'] },
      ],
    },
    {
      slug: 'languages',
      title: 'Prepara un curriculum in un’altra lingua',
      description: 'Adatta il documento al destinatario e verifica le sfumature che una traduzione può perdere.',
      readingTime: '3 min',
      sections: [
        { title: 'Scegli la lingua della candidatura', paragraphs: ['L’annuncio spesso indica la lingua richiesta. Per una selezione internazionale in inglese può essere ragionevole inviare un curriculum in inglese, ma controlla sempre le istruzioni. Mantieni titoli, date e descrizioni nella stessa lingua per rendere il documento coerente.'] },
        { title: 'Traduci il significato e conserva i nomi', paragraphs: ['Una traduzione utile mantiene il significato delle tue esperienze. Di norma, nomi di aziende, strumenti e marchi non cambiano. Un ruolo può richiedere una breve spiegazione se manca un equivalente diretto. Non trasformare un titolo di studio in una qualifica estera che non possiedi.'], bullets: ['Verifica ruoli professionali e termini del settore.', 'Spiega le sigle locali che il destinatario potrebbe non conoscere.', 'Conserva i nomi ufficiali delle certificazioni quando opportuno.', 'Controlla numeri, unità, date e nomi propri.'] },
        { title: 'Rivedi gli aiuti automatici', paragraphs: ['La traduzione automatica può interpretare male una responsabilità, un livello di esperienza o un’espressione locale. Leggi ogni sezione e, se possibile, chiedi una revisione a chi conosce sia la lingua sia il tuo settore. Devi poter spiegare quanto scritto durante un colloquio.', 'Un testo corretto grammaticalmente può comunque suonare poco naturale. Preferisci frasi dirette e un lessico professionale comune alle traduzioni letterali.'] },
        { title: 'Descrivi le lingue con precisione', paragraphs: ['La lingua del documento è distinta dalla tua capacità di lavorare in quella lingua. Indica il tuo livello con sincerità e aggiungi certificazioni soltanto se le possiedi. Se usi una scala come A1–C2, verifica il significato dei livelli: tradurre il curriculum non determina un livello linguistico.', 'Prima dell’invio, rileggi tutta la versione esportata, compresi titoli e formati delle date.'] },
      ],
    },
  ],
  pt: [
    {
      slug: 'first-cv',
      title: 'Seu primeiro currículo começa com experiências que você já tem',
      description: 'Transforme estudos, projetos e atividades em informações úteis para sua primeira candidatura.',
      readingTime: '3 min',
      sections: [
        { title: 'Comece com um objetivo específico', paragraphs: ['Antes de escrever, escolha o tipo de vaga ao qual deseja se candidatar. Leia vários anúncios e anote tarefas, ferramentas e conhecimentos que se repetem. Seu currículo deve ajudar a entender como você pode contribuir para esse trabalho, mesmo sem ter um emprego formal anterior.'] },
        { title: 'Procure experiências além do emprego', paragraphs: ['Projetos acadêmicos, estágios, voluntariado e colaboração em um negócio da família podem demonstrar habilidades. Descreva o contexto e sua participação real. Não transforme uma atividade ocasional em um cargo que você nunca ocupou.'], bullets: ['Informe o nome do projeto ou da organização e as datas.', 'Explique o que você fez, quais ferramentas usou e o que entregou.', 'Inclua um link para uma amostra pública e relevante do seu trabalho, se houver.'] },
        { title: 'Use exemplos em vez de adjetivos', paragraphs: ['“Responsável e proativo” diz pouco sem uma evidência. É mais útil explicar uma tarefa concreta. Exemplo fictício: “Organizei o cronograma de um projeto acadêmico e preparei a apresentação final com uma equipe de quatro estudantes”. Use a frase como estrutura, nunca como uma experiência sua.'] },
        { title: 'Organize e revise', paragraphs: ['Coloque formação ou projetos primeiro quando forem suas evidências mais fortes. Inclua contatos atualizados, habilidades que possa demonstrar e níveis de idiomas honestos. Uma página costuma ser suficiente no início, mas a clareza importa mais do que um tamanho fixo.', 'Revise datas, ortografia, links e o arquivo exportado. Peça a alguém que identifique rapidamente seu objetivo e duas habilidades relevantes. Se isso for difícil, simplifique o conteúdo.'] },
      ],
    },
    {
      slug: 'achievements',
      title: 'Descreva conquistas sem inventar números',
      description: 'Mostre o valor do seu trabalho com ações, contexto e resultados que consiga explicar.',
      readingTime: '3 min',
      sections: [
        { title: 'Separe responsabilidades e contribuições', paragraphs: ['Uma responsabilidade mostra o que estava sob seus cuidados; uma contribuição mostra o que você realizou ou melhorou. Ambas podem ser úteis. Lembre-se de problemas resolvidos, processos organizados, entregas concluídas ou conhecimentos compartilhados. Nem todo resultado precisa de uma porcentagem.'] },
        { title: 'Use ação, contexto e resultado', paragraphs: ['Comece com um verbo específico, acrescente o contexto necessário e termine com o resultado observado. Exemplo fictício: “Organizei as dúvidas frequentes em um guia interno usado pela equipe para responder a casos recorrentes”. A frase apresenta uma ação e um uso verificável sem inventar uma melhoria numérica.'], bullets: ['Ação: preparei, coordenei, analisei, desenvolvi ou resolvi.', 'Contexto: processo, equipe, ferramentas ou escopo.', 'Resultado: entrega concluída, problema resolvido ou mudança documentada.'] },
        { title: 'Inclua números apenas com respaldo', paragraphs: ['Use quantidades que lembre com precisão ou possa verificar em registros que tenha autorização para consultar. Explique o período e sua participação no resultado. Em trabalhos coletivos, use expressões como “contribuí” ou “em conjunto com a equipe”.', 'Sem dados confiáveis, descreva um resultado qualitativo. Não transforme uma impressão em porcentagem nem revele informações confidenciais de clientes ou empregadores.'] },
        { title: 'Selecione o que importa para a vaga', paragraphs: ['Escolha duas ou três contribuições relevantes por experiência em vez de listar todas as tarefas. Evite repetir a mesma conquista em várias seções. Leia as frases em voz alta e verifique se poderia explicar o contexto em uma entrevista sem exagerar sua responsabilidade.'] },
      ],
    },
    {
      slug: 'ats',
      title: 'Um currículo claro para pessoas e sistemas ATS',
      description: 'Reduza problemas de leitura automática sem perder precisão ou legibilidade.',
      readingTime: '3 min',
      sections: [
        { title: 'O que um ATS pode fazer', paragraphs: ['Um sistema de acompanhamento de candidaturas pode armazenar inscrições, extrair informações e facilitar buscas. O funcionamento depende da plataforma e das configurações de cada empregador. Nenhum modelo garante passar por um filtro ou conseguir uma entrevista. A prioridade é apresentar informações claras e relevantes.'] },
        { title: 'Escolha uma estrutura simples', paragraphs: ['Para candidaturas enviadas por formulário, uma coluna costuma favorecer uma ordem de leitura clara. Use títulos comuns, como Experiência, Formação e Habilidades. Escreva seu e-mail e telefone como texto, sem depender apenas de ícones.'], bullets: ['Mantenha datas e nomes de cargos em um formato consistente.', 'Evite transformar o documento inteiro em uma imagem.', 'Confira se o texto do PDF pode ser selecionado e copiado.', 'Coloque informações essenciais no corpo do documento.'] },
        { title: 'Adapte o vocabulário com honestidade', paragraphs: ['Leia o anúncio e use seus termos quando eles descreverem sua experiência real. Se domina uma ferramenta solicitada, mencione o nome explicitamente. Não inclua habilidades que não tem, palavras-chave escondidas ou repetições artificiais. O documento também precisa fazer sentido para quem o lê.'] },
        { title: 'Confira a extração e as instruções', paragraphs: ['Copie o conteúdo do PDF para um editor de texto e examine a ordem das seções. Essa verificação encontra alguns problemas, mas não reproduz todos os sistemas ATS. Se o formulário extrair seus dados, revise-os antes de enviar.', 'Respeite o formato solicitado pela empresa. Se pedir Word, envie Word e confira a paginação. Se aceitar PDF, use um arquivo com texto legível e nome claro.'] },
      ],
    },
    {
      slug: 'photo',
      title: 'Vale a pena colocar foto no currículo?',
      description: 'Considere o destino da candidatura e prepare uma imagem adequada se precisar dela.',
      readingTime: '3 min',
      sections: [
        { title: 'A foto é opcional', paragraphs: ['Não existe uma regra universal. As práticas variam conforme o país, o setor e a organização. Alguns processos esperam uma foto; outros preferem evitar informações pessoais desnecessárias. Confira as instruções da vaga e os costumes do mercado em que deseja trabalhar.'] },
        { title: 'Avalie o que ela acrescenta', paragraphs: ['Experiência, habilidades e formação devem continuar no centro do documento. Uma fotografia não comprova capacidade profissional. Se a vaga não pede foto e você não tem uma razão clara para incluí-la, pode escolher um modelo sem imagem. Nunca use a foto de outra pessoa ou uma representação que altere sua identidade.'] },
        { title: 'Prepare uma imagem simples', paragraphs: ['Se decidir incluí-la, use uma foto recente, com luz uniforme e fundo limpo. Escolha um enquadramento de rosto e ombros e uma expressão natural. A roupa pode refletir o contexto profissional sem se tornar uma exigência rígida.'], bullets: ['Evite filtros intensos, recortes de fotos de grupo e fundos que distraiam.', 'Confira se o rosto não ficou cortado na prévia.', 'Verifique nitidez e tamanho no PDF e no Word.', 'Use somente imagens que tenha direito de utilizar.'] },
        { title: 'Cuide da privacidade e do resultado final', paragraphs: ['O CVonline trabalha com a foto e os dados do currículo na memória da aba. Recarregar ou fechar a aba elimina o trabalho; baixe o resultado antes de sair.', 'Confira se a foto não cobre texto nem desloca uma seção importante para outra página. Compare versões com e sem foto e escolha a mais adequada para a candidatura.'] },
      ],
    },
    {
      slug: 'pdf-word',
      title: 'PDF ou Word: escolha e revise seu arquivo',
      description: 'Saiba o que cada formato oferece e o que conferir antes de compartilhar.',
      readingTime: '3 min',
      sections: [
        { title: 'Siga primeiro as instruções da vaga', paragraphs: ['O formato solicitado pela empresa tem prioridade sobre uma preferência pessoal. Confira as extensões aceitas e o tamanho máximo do arquivo. Sem instruções específicas, o PDF costuma ser útil para compartilhar uma apresentação estável; o Word facilita a edição do conteúdo.'] },
        { title: 'O que conferir em um PDF', paragraphs: ['Abra o arquivo baixado e revise todas as páginas, não apenas a prévia do editor. O texto deve estar nítido, ser selecionável e manter uma ordem razoável ao ser copiado. Uma captura de tela ou página digitalizada não oferece as mesmas possibilidades de leitura.'], bullets: ['Procure linhas, seções ou fotos cortadas.', 'Confira contatos, links e caracteres especiais.', 'Verifique se não há páginas vazias no final.', 'Garanta contraste suficiente para o texto.'] },
        { title: 'O que conferir no Word', paragraphs: ['A paginação pode mudar entre Word, LibreOffice e outros editores por causa das fontes e das regras de layout. Abra o DOCX no programa que pretende usar e revise margens, quebras de página, listas e fotos. Fontes comuns facilitam o compartilhamento de um arquivo editável.', 'Depois de fazer alterações, revise novamente. Não presuma que o documento ficará idêntico ao PDF gerado anteriormente.'] },
        { title: 'Prepare o envio', paragraphs: ['Use um nome reconhecível, como Nome_Sobrenome_CV, e acrescente idioma ou cargo se mantiver várias versões. Evite dados sensíveis no nome do arquivo. Guarde a versão enviada para se preparar para uma entrevista e atualize os dois formatos quando mudar o conteúdo.'] },
      ],
    },
    {
      slug: 'languages',
      title: 'Prepare um currículo em outro idioma',
      description: 'Adapte o documento ao destinatário e confira detalhes que uma tradução pode perder.',
      readingTime: '3 min',
      sections: [
        { title: 'Escolha o idioma da candidatura', paragraphs: ['O anúncio costuma indicar o idioma esperado. Em um processo internacional conduzido em inglês, pode ser adequado apresentar o currículo em inglês, mas confira as instruções. Mantenha títulos, datas e descrições no mesmo idioma para que o documento seja consistente.'] },
        { title: 'Traduza o sentido e preserve os nomes', paragraphs: ['Uma tradução útil mantém o significado da sua experiência. Nomes de empresas, ferramentas e marcas geralmente são preservados. Um cargo pode precisar de uma breve explicação quando não há equivalente direto. Não transforme uma formação em uma credencial estrangeira que você não possui.'], bullets: ['Confira cargos e termos do setor.', 'Explique siglas locais que o destinatário talvez não conheça.', 'Preserve os nomes oficiais das certificações quando apropriado.', 'Revise números, unidades, datas e nomes próprios.'] },
        { title: 'Revise qualquer ajuda automática', paragraphs: ['A tradução automática pode interpretar mal uma responsabilidade, um nível de experiência ou uma expressão local. Leia todas as seções e, quando possível, peça a revisão de alguém que conheça o idioma e seu setor. Você precisa conseguir explicar o conteúdo em uma entrevista.', 'Um texto gramaticalmente correto também pode soar pouco natural. Prefira frases diretas e vocabulário profissional comum a traduções literais.'] },
        { title: 'Informe seus idiomas com precisão', paragraphs: ['O idioma do documento é diferente da sua capacidade de trabalhar nele. Descreva seu nível com honestidade e inclua uma certificação apenas se a tiver. Se usar uma escala como A1–C2, confira o significado dos níveis; traduzir o currículo não define sua proficiência.', 'Revise a versão exportada inteira, incluindo títulos e formatos de data, antes de enviá-la.'] },
      ],
    },
  ],
};

export function getGuides(locale: Locale): Guide[] {
  return guides[locale];
}
