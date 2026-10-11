export type Locale = 'es' | 'en' | 'it' | 'pt';
export type Profile = 'experienced' | 'first-job' | 'career-change' | 'academic';
export type CvType = 'harvard' | 'chronological' | 'functional' | 'combination' | 'academic' | 'european' | 'technical' | 'creative';
export type TemplateTreatment = 'formal' | 'editorial' | 'frame' | 'rail' | 'banner' | 'timeline' | 'ledger' | 'portfolio';
export type TemplateLayoutVariant = 'standard' | 'contact-strip' | 'split-masthead' | 'label-column' | 'inset-heading' | 'top-rule' | 'centered-labels' | 'section-panels' | 'date-column' | 'bordered-header';
export type ResumeFontId = 'auto' | 'inter' | 'lato' | 'montserrat' | 'source-sans' | 'source-serif' | 'merriweather';
export type PaperSize = 'A4' | 'LETTER';

export interface Personal {
  name: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  website: string;
  linkedin: string;
  photo: string | null;
}
export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  achievements: string;
}
export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
}
export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}
export interface LanguageSkill { id: string; name: string; level: string }
export interface Certification { id: string; name: string; issuer: string; date: string }
export interface CustomSection { id: string; title: string; body: string }
export interface ResumeData {
  personal: Personal;
  profile: Profile;
  summary: string;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  languages: LanguageSkill[];
  certifications: Certification[];
  interests: string[];
  customSections: CustomSection[];
}
export interface TemplateDefinition {
  id: string;
  name: string;
  family: 'classic' | 'modern' | 'executive' | 'creative' | 'academic' | 'technical';
  columns: 1 | 2;
  accent: string;
  font: 'sans' | 'serif';
  header: 'left' | 'center' | 'band' | 'split' | 'minimal';
  density: 'compact' | 'comfortable';
  sidebar?: 'left' | 'right';
  sectionStyle: 'line' | 'bar' | 'caps' | 'dot';
  cvTypes: CvType[];
  treatment: TemplateTreatment;
  layoutVariant: TemplateLayoutVariant;
  sidebarWidth?: 25 | 29 | 33;
  pageInset?: 'standard' | 'narrow' | 'generous';
}
export interface ResumeSettings {
  locale: Locale;
  cvType: CvType;
  templateId: string;
  accent: string;
  paper: PaperSize;
  showPhoto: boolean;
  fontSize: number;
  fontFamily: ResumeFontId;
}
export const LOCALES: {code: Locale; name: string; short: string}[] = [
  {code:'es', name:'Español', short:'ES'}, {code:'en', name:'English', short:'EN'},
  {code:'it', name:'Italiano', short:'IT'}, {code:'pt', name:'Português', short:'PT'},
];
export const uid = () => crypto.randomUUID();
export const emptyResume = (): ResumeData => ({
  personal: {name:'', headline:'', email:'', phone:'', city:'', country:'', website:'', linkedin:'', photo:null},
  profile:'experienced', summary:'', experiences:[], education:[], projects:[], skills:[], languages:[], certifications:[], interests:[], customSections:[],
});
export const newExperience = (): Experience => ({id:uid(),role:'',company:'',location:'',start:'',end:'',current:false,description:'',achievements:''});
export const newEducation = (): Education => ({id:uid(),degree:'',institution:'',location:'',start:'',end:'',current:false,description:''});
export const sampleResume = (locale: Locale = 'es'): ResumeData => {
  const text = {
    es: {headline:'Diseñadora de producto', summary:'Diseñadora de producto con experiencia creando experiencias digitales claras y accesibles. Combino investigación, estrategia y atención al detalle para convertir ideas en productos útiles.', role:'Diseñadora de producto', description:'Diseño de experiencias web y móviles junto a equipos de producto e ingeniería.', achievements:'Rediseñé el proceso de bienvenida y reduje sus pasos de cinco a tres.\nCreé un sistema de diseño compartido para cuatro productos.', degree:'Grado en Diseño', skills:['Diseño de producto','Investigación','Figma','Prototipado'],project:'Sistema de diseño',projectDescription:'Biblioteca de componentes accesibles y guías de uso.'},
    en: {headline:'Product designer', summary:'Product designer experienced in creating clear and accessible digital experiences. I combine research, strategy and attention to detail to turn ideas into useful products.', role:'Product designer', description:'Designed web and mobile experiences with product and engineering teams.', achievements:'Redesigned onboarding and reduced its steps from five to three.\nCreated a shared design system for four products.',degree:'BA in Design', skills:['Product design','Research','Figma','Prototyping'],project:'Design system',projectDescription:'Accessible component library and usage guidelines.'},
    it: {headline:'Product designer', summary:'Designer con esperienza nella creazione di esperienze digitali chiare e accessibili. Unisco ricerca, strategia e attenzione ai dettagli per trasformare le idee in prodotti utili.', role:'Product designer', description:'Progettazione di esperienze web e mobile con team di prodotto e ingegneria.', achievements:'Ho riprogettato il percorso iniziale, riducendolo da cinque a tre passaggi.\nHo creato un sistema di design condiviso per quattro prodotti.',degree:'Laurea in Design',skills:['Design di prodotto','Ricerca','Figma','Prototipazione'],project:'Sistema di design',projectDescription:'Libreria di componenti accessibili e linee guida.'},
    pt: {headline:'Designer de produto',summary:'Designer com experiência na criação de experiências digitais claras e acessíveis. Combino pesquisa, estratégia e atenção aos detalhes para transformar ideias em produtos úteis.',role:'Designer de produto',description:'Design de experiências web e móveis com equipes de produto e engenharia.',achievements:'Redesenhei a integração inicial e reduzi as etapas de cinco para três.\nCriei um sistema de design compartilhado para quatro produtos.',degree:'Graduação em Design',skills:['Design de produto','Pesquisa','Figma','Prototipagem'],project:'Sistema de design',projectDescription:'Biblioteca de componentes acessíveis e diretrizes de uso.'},
  }[locale];
  return {
    ...emptyResume(), personal:{...emptyResume().personal,name:'Alex Morgan',headline:text.headline,email:'alex@example.com',phone:'+34 600 123 456',city:'Madrid',website:'alexmorgan.example'},summary:text.summary,
    experiences:[{id:'sample-job',role:text.role,company:'Studio North',location:'Madrid',start:'2022-03',end:'',current:true,description:text.description,achievements:text.achievements}],
    education:[{id:'sample-degree',degree:text.degree,institution:'Universidad de Diseño',location:'Madrid',start:'2017-09',end:'2021-06',current:false,description:''}],
    projects:[{id:'sample-project',name:text.project,link:'',description:text.projectDescription}],skills:text.skills,
    languages:[{id:'sample-language',name:{es:'Inglés',en:'English',it:'Inglese',pt:'Inglês'}[locale],level:'C1'}],
  };
};
