import type { Locale, ResumeData, ResumeSettings } from './model';

const TEXT = {
  es: {summary:'Perfil profesional',experience:'Experiencia',education:'Formación',projects:'Proyectos',skills:'Competencias',languages:'Idiomas',certifications:'Certificaciones',interests:'Intereses',present:'Actualidad',contact:'Contacto',name:'Tu nombre',custom:'Información adicional',profile:'Tu profesión',continued:'Continuación'},
  en: {summary:'Professional profile',experience:'Experience',education:'Education',projects:'Projects',skills:'Skills',languages:'Languages',certifications:'Certifications',interests:'Interests',present:'Present',contact:'Contact',name:'Your name',custom:'Additional information',profile:'Your profession',continued:'Continued'},
  it: {summary:'Profilo professionale',experience:'Esperienza',education:'Formazione',projects:'Progetti',skills:'Competenze',languages:'Lingue',certifications:'Certificazioni',interests:'Interessi',present:'In corso',contact:'Contatti',name:'Il tuo nome',custom:'Informazioni aggiuntive',profile:'La tua professione',continued:'Continua'},
  pt: {summary:'Perfil profissional',experience:'Experiência',education:'Formação',projects:'Projetos',skills:'Competências',languages:'Idiomas',certifications:'Certificações',interests:'Interesses',present:'Atual',contact:'Contato',name:'Seu nome',custom:'Informações adicionais',profile:'Sua profissão',continued:'Continuação'},
};
export const resumeLabels = (locale: Locale) => TEXT[locale] ?? TEXT.es;
export const cleanText = (value: string): string => value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
export const safeAccent = (value: string, fallback = '#145b64') => /^#[\da-f]{6}$/i.test(value) ? value : fallback;
export const safeFontSize = (value: number) => Number.isFinite(value) ? Math.max(9, Math.min(13, value)) : 10;

export function formatDate(value: string, locale: Locale): string {
  if (!value) return '';
  const match = /^(\d{4})(?:-(\d{2}))?$/.exec(value);
  if (!match) return cleanText(value);
  if (!match[2]) return match[1];
  const month = Number(match[2]);
  if (month < 1 || month > 12) return cleanText(value);
  return new Intl.DateTimeFormat(locale, {month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(Number(match[1]), month - 1, 1)));
}
export function dateRange(start: string, end: string, current: boolean, locale: Locale): string {
  return [formatDate(start, locale), current ? resumeLabels(locale).present : formatDate(end, locale)].filter(Boolean).join(' — ');
}
/** Only links opened by a user are allowed. The CV never fetches these URLs. */
export function safeUrl(value: string): string | undefined {
  const text = cleanText(value);
  if (!text || /[\s\u0000-\u001f]/.test(text)) return undefined;
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(text);
  try {
    const url = new URL(hasScheme ? text : `https://${text}`);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}
export function safePhoto(value: string | null): string | undefined {
  return value && /^data:image\/(?:png|jpe?g);base64,[a-z\d+/=\s]+$/i.test(value) ? value : undefined;
}
export function fileName(data: ResumeData, ext: string): string {
  const name = data.personal.name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\d _-]/gi, '').trim().replace(/\s+/g, '-').slice(0, 64) || 'curriculum';
  return `CVonline-${name}.${ext.replace(/[^a-z\d]/gi,'')}`;
}
export function contactItems(data: ResumeData): {text:string; href?:string}[] {
  const person = data.personal;
  const items: {text:string; href?:string}[] = [];
  if (person.email.trim()) items.push({text:person.email,href:safeUrl(`mailto:${person.email.trim()}`)});
  if (person.phone.trim()) items.push({text:person.phone});
  const location = [person.city,person.country].filter(value => value.trim()).join(', ');
  if (location) items.push({text:location});
  if (person.website.trim()) items.push({text:person.website,href:safeUrl(person.website)});
  if (person.linkedin.trim()) items.push({text:person.linkedin,href:safeUrl(person.linkedin)});
  return items;
}
export interface ResumeEntry {title?:string;subtitle?:string;date?:string;body?:string;bullets?:string[];link?:string;linkText?:string}
export interface ResumeSection {id:string;title:string;entries:ResumeEntry[];auxiliary?:boolean}
export function resumeSections(data: ResumeData, settings: ResumeSettings): ResumeSection[] {
  const labels = resumeLabels(settings.locale);
  const sections: ResumeSection[] = [];
  if (data.summary.trim()) sections.push({id:'summary',title:labels.summary,entries:[{body:data.summary}]});
  const experience: ResumeSection = {id:'experience',title:labels.experience,entries:data.experiences.filter(e => [e.role,e.company,e.location,e.start,e.end,e.description,e.achievements].some(v => v.trim()) || e.current).map(e => ({title:e.role,subtitle:[e.company,e.location].filter(Boolean).join(' · '),date:dateRange(e.start,e.end,e.current,settings.locale),body:e.description,bullets:e.achievements.split('\n').map(line => line.replace(/^\s*[-•*]\s*/, '').trim()).filter(Boolean)}))};
  const education: ResumeSection = {id:'education',title:labels.education,entries:data.education.filter(e => [e.degree,e.institution,e.location,e.start,e.end,e.description].some(v => v.trim()) || e.current).map(e => ({title:e.degree,subtitle:[e.institution,e.location].filter(Boolean).join(' · '),date:dateRange(e.start,e.end,e.current,settings.locale),body:e.description}))};
  if (data.profile === 'first-job' || data.profile === 'academic') sections.push(education,experience); else sections.push(experience,education);
  sections.push({id:'projects',title:labels.projects,entries:data.projects.filter(p => [p.name,p.description,p.link].some(v => v.trim())).map(p => ({title:p.name,body:p.description,link:safeUrl(p.link),linkText:p.link}))});
  for (const section of data.customSections) if (section.title.trim() || section.body.trim()) sections.push({id:`custom-${section.id}`,title:section.title.trim() || labels.custom,entries:[{body:section.body}]});
  sections.push(
    {id:'skills',title:labels.skills,auxiliary:true,entries:data.skills.filter(v => v.trim()).map(v => ({body:v}))},
    {id:'languages',title:labels.languages,auxiliary:true,entries:data.languages.filter(v => v.name.trim() || v.level.trim()).map(v => ({title:v.name,subtitle:v.level}))},
    {id:'certifications',title:labels.certifications,auxiliary:true,entries:data.certifications.filter(v => v.name.trim() || v.issuer.trim() || v.date.trim()).map(v => ({title:v.name,subtitle:v.issuer,date:formatDate(v.date,settings.locale)}))},
    {id:'interests',title:labels.interests,auxiliary:true,entries:data.interests.filter(v => v.trim()).map(v => ({body:v}))},
  );
  return sections.filter(section => section.entries.length);
}

export function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
