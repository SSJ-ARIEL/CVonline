import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  PageBorderOffsetFrom,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from 'docx';
import type { ResumeData, ResumeSettings } from '../model';
import { getResumeFont } from '../fonts';
import { accentInkColor, accentTextColor, getTemplate } from '../templates';
import { fileName, resumeLabels, resumeSections, safeFontSize, safeUrl } from '../resume-text';

/** Word uses flowing, editable paragraphs so long CVs never get cut off. */
export async function createDocxBlob(data: ResumeData, settings: ResumeSettings): Promise<Blob> {
  const template = getTemplate(settings.templateId);
  const labels = resumeLabels(settings.locale);
  const font = getResumeFont(settings.fontFamily, template.font).fontWordName;
  const variant = template.layoutVariant;
  const accent = /^[\da-f]{6}$/i.test(settings.accent.replace(/^#/, ''))
    ? settings.accent.replace(/^#/, '').toUpperCase()
    : template.accent.replace(/^#/, '').toUpperCase();
  const inkAccent = accentInkColor(`#${accent}`).slice(1).toUpperCase();
  const pointSize = safeFontSize(settings.fontSize);
  const bodySize = Math.round(pointSize * 2);
  const centered = template.header === 'center' || variant === 'centered-labels';
  const treatment = template.treatment;
  const filledHeader = template.header === 'band' || treatment === 'rail';
  const headerFill = accent;
  const headerText = accentTextColor(`#${headerFill}`).slice(1).toUpperCase();
  const spacingAfter = template.density === 'compact' ? 75 : 110;
  const paragraphs: Paragraph[] = [];

  const clean = (value: string) => value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const run = (text: string, options: { bold?: boolean; color?: string; size?: number; italics?: boolean } = {}) =>
    new TextRun({ text: clean(text), font, size: bodySize, ...options });
  const paragraph = (text: string, options: { bold?: boolean; color?: string; italics?: boolean; size?: number } = {}) =>
    new Paragraph({
      children: clean(text).split(/\r?\n/).flatMap((line, index) => [
        ...(index ? [new TextRun({ break: 1 })] : []), run(line, options),
      ]),
      spacing: { after: spacingAfter, line: 270 },
    });
  const addBody = (text: string) => {
    if (text.trim()) paragraphs.push(paragraph(text));
  };
  const addHeading = (title: string, ordinal: number) => {
    const heading = `${treatment==='ledger'?`${String(ordinal).padStart(2,'0')} / `:''}${template.sectionStyle==='dot'?'● ':''}${title}`;
    paragraphs.push(new Paragraph({
      children: [run(template.sectionStyle === 'caps' ? heading.toLocaleUpperCase(settings.locale) : heading, {
        bold: true, size: bodySize + 2, color: inkAccent,
      })],
      heading: HeadingLevel.HEADING_1,
      keepNext: true,
      spacing: { before: 230, after: 110 },
      ...(variant === 'centered-labels' ? { alignment: AlignmentType.CENTER } : {}),
      ...(variant === 'label-column' ? { indent: { left: 200, right: 2200 } } : {}),
      ...(variant === 'inset-heading' ? { indent: { left: 150, right: 150 }, shading: { type: ShadingType.CLEAR, fill: 'EEF1F4', color: 'auto' } } : {}),
      ...(template.sectionStyle === 'line' || template.sectionStyle === 'bar' ? {
        border: { bottom: { color: accent, size: template.sectionStyle === 'bar' ? 12 : 4, style: BorderStyle.SINGLE, space: 4 } },
      } : {}),
      ...(variant === 'section-panels' ? { border: { top: { color: accent, size: 4, style: BorderStyle.SINGLE, space: 6 }, bottom: { color: accent, size: 4, style: BorderStyle.SINGLE, space: 6 } } } : {}),
    }));
  };
  const addEntryTitle = (primary: string, secondary?: string, projectCard = false) => {
    const parts = [primary, secondary].filter((value) => value?.trim());
    if (parts.length) paragraphs.push(new Paragraph({
      children: [run(parts.join(' · '), { bold: true })],
      keepNext: true,
      spacing: { before: 80, after: 45 },
      ...(projectCard ? { border: { top: { color: accent, size: 4, style: BorderStyle.SINGLE, space: 5 }, left: { color: accent, size: 4, style: BorderStyle.SINGLE, space: 5 } }, indent: { left: 100 } } : {}),
    }));
  };
  const addLink = (value: string) => {
    if (!value.trim()) return;
    const link = safeUrl(value);
    paragraphs.push(new Paragraph({
      children: [link ? new ExternalHyperlink({
        link,
        children: [run(value, { color: inkAccent })],
      }) : run(value)],
      spacing: { after: spacingAfter },
    }));
  };

  const image = settings.showPhoto && data.personal.photo ? await photoRun(data.personal.photo) : undefined;
  if (image) paragraphs.push(new Paragraph({
    children: [image],
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 100 },
  }));
  if (data.personal.name.trim()) paragraphs.push(new Paragraph({
    children: [new TextRun({ text: clean(data.personal.name), font:treatment==='portfolio'&&settings.fontFamily==='auto'?'Cambria':font, bold: !['editorial','portfolio','formal'].includes(treatment), size: treatment==='editorial'||treatment==='portfolio'?60:48, color: filledHeader ? headerText : treatment==='portfolio'?inkAccent:'202830' })],
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
    keepNext: true,
    spacing: { after: 95 },
    ...(filledHeader ? {
      shading: { type: ShadingType.CLEAR, fill: headerFill, color: 'auto' },
      border: {
        top: { style: BorderStyle.SINGLE, color: headerFill, size: 12, space: 8 },
        bottom: { style: BorderStyle.SINGLE, color: headerFill, size: 12, space: 8 },
      },
    } : {}),
    ...(variant==='split-masthead'?{indent:{left:220},border:{left:{style:BorderStyle.SINGLE,color:accent,size:16,space:8}}}:{}),
    ...(variant==='top-rule'?{border:{top:{style:BorderStyle.SINGLE,color:accent,size:16,space:10}}}:{}),
    ...(variant==='bordered-header'?{border:{top:{style:BorderStyle.SINGLE,color:accent,size:5,space:8},bottom:{style:BorderStyle.SINGLE,color:accent,size:5,space:8},left:{style:BorderStyle.SINGLE,color:accent,size:5,space:8},right:{style:BorderStyle.SINGLE,color:accent,size:5,space:8}}}:{}),
  }));
  if (data.personal.headline.trim()) paragraphs.push(new Paragraph({
    children: [run(data.personal.headline, { size: bodySize + 4, color: inkAccent })],
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
    keepNext: true,
    spacing: { after: 130 },
  }));
  const contactItems: (TextRun | ExternalHyperlink)[] = [];
  const addContact = (value: string, link?: string) => {
    if (!value.trim()) return;
    if (contactItems.length) contactItems.push(run('  ·  ', { color: '59616B', size: Math.max(16, bodySize - 2) }));
    const safe = link ? safeUrl(link) : undefined;
    const child = run(value, { color: '59616B', size: Math.max(16, bodySize - 2) });
    contactItems.push(safe ? new ExternalHyperlink({ children: [child], link: safe }) : child);
  };
  addContact(data.personal.email, `mailto:${data.personal.email}`);
  addContact(data.personal.phone);
  addContact([data.personal.city, data.personal.country].filter(Boolean).join(', '));
  addContact(data.personal.website, data.personal.website);
  addContact(data.personal.linkedin, data.personal.linkedin);
  if (contactItems.length) paragraphs.push(new Paragraph({
    children: contactItems,
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 140, line: 280 },
    border: { bottom: { color: accent, style: BorderStyle.SINGLE, size: 5, space: 8 } },
    ...(variant==='contact-strip'?{border:{top:{style:BorderStyle.SINGLE,color:accent,size:4,space:6},bottom:{style:BorderStyle.SINGLE,color:accent,size:4,space:6}}}:{}),
  }));

  // Preserve the selected CV structure in editable, flowing paragraphs. Two
  // columns are intentionally adapted to one column for reliable Word editing.
  for (const [index,section] of resumeSections(data, settings).entries()) {
    addHeading(section.title,index+1);
    if (section.id === 'skills' || section.id === 'interests') {
      addBody(section.entries.map(entry => entry.body).filter(Boolean).join(' · '));
      continue;
    }
    for (const entry of section.entries) {
      const dateFirst = variant==='date-column' || treatment==='timeline' && ['experience','education','certifications'].includes(section.id);
      if (dateFirst&&entry.date) paragraphs.push(variant==='date-column'?new Paragraph({children:[run(entry.date,{color:inkAccent,size:Math.max(16,bodySize-2)})],alignment:AlignmentType.RIGHT,keepNext:true,spacing:{after:45}}):paragraph(entry.date, { color: inkAccent, size: Math.max(16, bodySize - 2) }));
      if (entry.title) addEntryTitle(entry.title,undefined,treatment==='portfolio'&&section.id==='projects');
      if (entry.subtitle) paragraphs.push(paragraph(entry.subtitle, { color: '59616B', size: Math.max(16, bodySize - 2) }));
      if (!dateFirst&&entry.date) paragraphs.push(paragraph(entry.date, { color: '59616B', size: Math.max(16, bodySize - 2) }));
      if (entry.body) addBody(entry.body);
      for (const bullet of entry.bullets ?? []) paragraphs.push(new Paragraph({
        children: [run(bullet)], bullet: { level: 0 }, spacing: { after: 75, line: 270 },
      }));
      if (entry.linkText) addLink(entry.linkText);
    }
  }

  const document = new Document({
    creator: 'CVonline',
    title: data.personal.name ? `${labels.profile} — ${clean(data.personal.name)}` : 'CVonline',
    description: 'CVonline',
    styles: { default: {
      document: { run: { font, size: bodySize, color: '202830' } },
      heading1: { run: { font, bold: true, size: bodySize + 2, color: inkAccent } },
      hyperlink: { run: { font } },
    } },
    sections: [{
      properties: {
        page: {
          size: settings.paper === 'LETTER' ? { width: 12240, height: 15840 } : { width: 11906, height: 16838 },
          margin: { top: 850, bottom: 850, left: template.pageInset==='narrow'?720:template.pageInset==='generous'?1120:950, right: template.pageInset==='narrow'?720:template.pageInset==='generous'?1120:950 },
          ...(treatment==='frame'?{borders:{
            pageBorders:{offsetFrom:PageBorderOffsetFrom.PAGE},
            pageBorderTop:{color:accent,size:4,space:20,style:BorderStyle.SINGLE},
            pageBorderRight:{color:accent,size:4,space:20,style:BorderStyle.SINGLE},
            pageBorderBottom:{color:accent,size:4,space:20,style:BorderStyle.SINGLE},
            pageBorderLeft:{color:accent,size:4,space:20,style:BorderStyle.SINGLE},
          }}:{}),
        },
      },
      children: paragraphs.length ? paragraphs : [new Paragraph({ children: [] })],
    }],
  });
  return Packer.toBlob(document);
}

async function photoRun(uri: string): Promise<ImageRun | undefined> {
  const match = /^data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\r\n]+)$/i.exec(uri);
  if (!match) throw new Error('The Word photo must be a PNG or JPEG image.');
  const bytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0));
  const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const photo = new Image();
    photo.onload = () => resolve({ width: photo.naturalWidth, height: photo.naturalHeight });
    photo.onerror = () => reject(new Error('The resume photo could not be read.'));
    photo.src = uri;
  });
  const scale = Math.min(88 / dimensions.width, 88 / dimensions.height);
  return new ImageRun({
    type: match[1].toLowerCase() === 'png' ? 'png' : 'jpg',
    data: bytes,
    transformation: { width: Math.max(1, Math.round(dimensions.width * scale)), height: Math.max(1, Math.round(dimensions.height * scale)) },
  });
}

export async function downloadDocx(data: ResumeData, settings: ResumeSettings): Promise<void> {
  const blob = await createDocxBlob(data, settings);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName(data, 'docx');
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
