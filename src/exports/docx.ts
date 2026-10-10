import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from 'docx';
import type { ResumeData, ResumeSettings } from '../model';
import { getTemplate } from '../templates';
import { fileName, resumeLabels, resumeSections, safeFontSize, safeUrl } from '../resume-text';

/** Word uses flowing, editable paragraphs so long CVs never get cut off. */
export async function createDocxBlob(data: ResumeData, settings: ResumeSettings): Promise<Blob> {
  const template = getTemplate(settings.templateId);
  const labels = resumeLabels(settings.locale);
  const font = template.font === 'serif' ? 'Cambria' : 'Calibri';
  const accent = /^[\da-f]{6}$/i.test(settings.accent.replace(/^#/, ''))
    ? settings.accent.replace(/^#/, '').toUpperCase()
    : template.accent.replace(/^#/, '').toUpperCase();
  const pointSize = safeFontSize(settings.fontSize);
  const bodySize = Math.round(pointSize * 2);
  const centered = template.header === 'center';
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
  const addHeading = (title: string) => {
    paragraphs.push(new Paragraph({
      children: [run(template.sectionStyle === 'caps' ? title.toLocaleUpperCase(settings.locale) : title, {
        bold: true, size: bodySize + 2, color: accent,
      })],
      heading: HeadingLevel.HEADING_1,
      keepNext: true,
      spacing: { before: 230, after: 110 },
      ...(template.sectionStyle === 'line' || template.sectionStyle === 'bar' ? {
        border: { bottom: { color: accent, size: template.sectionStyle === 'bar' ? 12 : 4, style: BorderStyle.SINGLE, space: 4 } },
      } : {}),
      ...(template.sectionStyle === 'dot' ? { indent: { left: 0 }, children: [run('● ', { color: accent }), run(title, { bold: true, size: bodySize + 2, color: accent })] } : {}),
    }));
  };
  const addEntryTitle = (primary: string, secondary?: string) => {
    const parts = [primary, secondary].filter((value) => value?.trim());
    if (parts.length) paragraphs.push(new Paragraph({
      children: [run(parts.join(' · '), { bold: true })],
      keepNext: true,
      spacing: { before: 80, after: 45 },
    }));
  };
  const addLink = (value: string) => {
    if (!value.trim()) return;
    const link = safeUrl(value);
    paragraphs.push(new Paragraph({
      children: [link ? new ExternalHyperlink({
        link,
        children: [run(value, { color: accent })],
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
    children: [run(data.personal.name, { bold: true, size: 48, color: template.header === 'band' ? 'FFFFFF' : '202830' })],
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
    keepNext: true,
    spacing: { after: 95 },
    ...(template.header === 'band' ? {
      shading: { type: ShadingType.CLEAR, fill: accent, color: 'auto' },
      border: {
        top: { style: BorderStyle.SINGLE, color: accent, size: 12, space: 8 },
        bottom: { style: BorderStyle.SINGLE, color: accent, size: 12, space: 8 },
      },
    } : {}),
  }));
  if (data.personal.headline.trim()) paragraphs.push(new Paragraph({
    children: [run(data.personal.headline, { size: bodySize + 4, color: accent })],
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
  }));

  // Shared section assembly keeps PDF, preview and Word content and ordering
  // identical. Academic and first-job profiles put education before work.
  for (const section of resumeSections(data, settings)) {
    addHeading(section.title);
    if (section.id === 'skills' || section.id === 'interests') {
      addBody(section.entries.map(entry => entry.body).filter(Boolean).join(' · '));
      continue;
    }
    for (const entry of section.entries) {
      if (entry.title) addEntryTitle(entry.title);
      if (entry.subtitle) paragraphs.push(paragraph(entry.subtitle, { color: '59616B', size: Math.max(16, bodySize - 2) }));
      if (entry.date) paragraphs.push(paragraph(entry.date, { color: '59616B', size: Math.max(16, bodySize - 2) }));
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
    styles: { default: { document: { run: { font, size: bodySize, color: '202830' } } } },
    sections: [{
      properties: {
        page: {
          size: settings.paper === 'LETTER' ? { width: 12240, height: 15840 } : { width: 11906, height: 16838 },
          margin: { top: 850, bottom: 850, left: 950, right: 950 },
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
