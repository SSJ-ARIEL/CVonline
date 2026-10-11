import type { CvType, TemplateDefinition, TemplateLayoutVariant } from './model';

/** Original CVonline compositions: no university endorsement or official Europass artwork. */
const FOUNDATIONS: Omit<TemplateDefinition, 'layoutVariant' | 'pageBackground'>[] = [
  // Harvard-inspired: restrained typography, generous margins, readable rules.
  {id:'folio',name:'Cambridge',cvTypes:['harvard'],treatment:'formal',family:'classic',columns:1,accent:'#262626',font:'serif',header:'center',density:'comfortable',sectionStyle:'line'},
  {id:'quincy',name:'Quincy',cvTypes:['harvard'],treatment:'frame',family:'classic',columns:1,accent:'#30343b',font:'serif',header:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'beacon',name:'Beacon',cvTypes:['harvard'],treatment:'ledger',family:'classic',columns:1,accent:'#202831',font:'sans',header:'minimal',density:'compact',sectionStyle:'line'},
  {id:'oxford',name:'Oxford',cvTypes:['harvard'],treatment:'editorial',family:'classic',columns:1,accent:'#343c48',font:'serif',header:'left',density:'comfortable',sectionStyle:'line'},
  {id:'winthrop',name:'Winthrop',cvTypes:['harvard'],treatment:'timeline',family:'classic',columns:1,accent:'#36474d',font:'sans',header:'split',density:'comfortable',sectionStyle:'caps'},
  // Chronological: career progression is the central visual narrative.
  {id:'atlas',name:'Atlas',cvTypes:['chronological'],treatment:'timeline',family:'modern',columns:1,accent:'#245d69',font:'sans',header:'split',density:'comfortable',sectionStyle:'caps'},
  {id:'prism',name:'Prism',cvTypes:['chronological'],treatment:'rail',family:'modern',columns:2,accent:'#244b52',font:'sans',header:'left',sidebar:'left',density:'comfortable',sectionStyle:'line'},
  {id:'monarch',name:'Monarch',cvTypes:['chronological'],treatment:'editorial',family:'executive',columns:1,accent:'#7c623b',font:'serif',header:'left',density:'comfortable',sectionStyle:'line'},
  {id:'cascade',name:'Cascade',cvTypes:['chronological'],treatment:'ledger',family:'modern',columns:1,accent:'#3f5668',font:'sans',header:'center',density:'comfortable',sectionStyle:'line'},
  {id:'chronicle',name:'Chronicle',cvTypes:['chronological'],treatment:'banner',family:'executive',columns:1,accent:'#414c55',font:'sans',header:'band',density:'comfortable',sectionStyle:'caps'},
  // Functional: transferable competencies and evidence precede job dates.
  {id:'focus',name:'Focus',cvTypes:['functional'],treatment:'ledger',family:'modern',columns:1,accent:'#385f69',font:'sans',header:'split',density:'comfortable',sectionStyle:'caps'},
  {id:'bridge',name:'Bridge',cvTypes:['functional'],treatment:'rail',family:'executive',columns:2,accent:'#3b4651',font:'sans',header:'left',sidebar:'right',density:'comfortable',sectionStyle:'caps'},
  {id:'momentum',name:'Momentum',cvTypes:['functional'],treatment:'frame',family:'modern',columns:1,accent:'#62705d',font:'sans',header:'left',density:'comfortable',sectionStyle:'bar'},
  {id:'clarity',name:'Clarity',cvTypes:['functional'],treatment:'banner',family:'modern',columns:1,accent:'#41645d',font:'sans',header:'band',density:'comfortable',sectionStyle:'line'},
  {id:'transfer',name:'Transfer',cvTypes:['functional'],treatment:'portfolio',family:'executive',columns:2,accent:'#426467',font:'sans',header:'left',sidebar:'left',density:'comfortable',sectionStyle:'caps'},
  // Combination: a competency overview followed by a dated career record.
  {id:'summit',name:'Summit',cvTypes:['combination'],treatment:'banner',family:'executive',columns:2,accent:'#675239',font:'sans',header:'band',sidebar:'right',density:'comfortable',sectionStyle:'caps'},
  {id:'nexus',name:'Nexus',cvTypes:['combination'],treatment:'ledger',family:'modern',columns:1,accent:'#334d71',font:'sans',header:'minimal',density:'comfortable',sectionStyle:'line'},
  {id:'regent',name:'Regent',cvTypes:['combination'],treatment:'editorial',family:'executive',columns:2,accent:'#6b544c',font:'serif',header:'left',sidebar:'right',density:'comfortable',sectionStyle:'line'},
  {id:'vantage',name:'Vantage',cvTypes:['combination'],treatment:'timeline',family:'executive',columns:1,accent:'#52685e',font:'sans',header:'split',density:'comfortable',sectionStyle:'line'},
  {id:'integral',name:'Integral',cvTypes:['combination'],treatment:'frame',family:'modern',columns:2,accent:'#3d596a',font:'sans',header:'left',sidebar:'left',density:'comfortable',sectionStyle:'caps'},
  // Academic: education, research and user-supplied publications lead.
  {id:'scholar',name:'Scholar',cvTypes:['academic'],treatment:'formal',family:'academic',columns:1,accent:'#283b53',font:'serif',header:'center',density:'comfortable',sectionStyle:'line'},
  {id:'index',name:'Index',cvTypes:['academic'],treatment:'ledger',family:'academic',columns:1,accent:'#51485f',font:'serif',header:'left',density:'compact',sectionStyle:'line'},
  {id:'archive',name:'Archive',cvTypes:['academic'],treatment:'frame',family:'academic',columns:1,accent:'#555b50',font:'serif',header:'minimal',density:'comfortable',sectionStyle:'caps'},
  {id:'thesis',name:'Thesis',cvTypes:['academic'],treatment:'editorial',family:'academic',columns:1,accent:'#4c485d',font:'serif',header:'left',density:'comfortable',sectionStyle:'line'},
  {id:'annals',name:'Annals',cvTypes:['academic'],treatment:'timeline',family:'academic',columns:1,accent:'#445861',font:'serif',header:'minimal',density:'comfortable',sectionStyle:'caps'},
  // European-inspired: consistent labels and prominent language information.
  {id:'europa',name:'Europa',cvTypes:['european'],treatment:'rail',family:'modern',columns:2,accent:'#234f7f',font:'sans',header:'left',sidebar:'left',density:'comfortable',sectionStyle:'line'},
  {id:'continental',name:'Continental',cvTypes:['european'],treatment:'banner',family:'classic',columns:1,accent:'#234f7f',font:'sans',header:'band',density:'comfortable',sectionStyle:'line'},
  {id:'meridian',name:'Meridian',cvTypes:['european'],treatment:'timeline',family:'modern',columns:1,accent:'#305f8f',font:'sans',header:'split',density:'comfortable',sectionStyle:'line'},
  {id:'diplomat',name:'Diplomat',cvTypes:['european'],treatment:'frame',family:'modern',columns:2,accent:'#345b7b',font:'sans',header:'left',sidebar:'right',density:'comfortable',sectionStyle:'line'},
  {id:'union',name:'Union',cvTypes:['european'],treatment:'ledger',family:'modern',columns:1,accent:'#2c5871',font:'sans',header:'split',density:'comfortable',sectionStyle:'caps'},
  // Technical: capabilities and projects stay in the main reading column.
  {id:'signal',name:'Signal',cvTypes:['technical'],treatment:'ledger',family:'technical',columns:1,accent:'#31576c',font:'sans',header:'minimal',density:'compact',sectionStyle:'caps'},
  {id:'orbit',name:'Orbit',cvTypes:['technical'],treatment:'rail',family:'technical',columns:2,accent:'#283b55',font:'sans',header:'left',sidebar:'right',density:'comfortable',sectionStyle:'caps'},
  {id:'vector',name:'Vector',cvTypes:['technical'],treatment:'frame',family:'technical',columns:1,accent:'#3d6666',font:'sans',header:'split',density:'comfortable',sectionStyle:'bar'},
  {id:'kernel',name:'Kernel',cvTypes:['technical'],treatment:'timeline',family:'technical',columns:1,accent:'#344967',font:'sans',header:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'matrix',name:'Matrix',cvTypes:['technical'],treatment:'banner',family:'technical',columns:2,accent:'#325a58',font:'sans',header:'band',sidebar:'left',density:'comfortable',sectionStyle:'line'},
  // Creative: portfolio evidence, typography and intentional asymmetry.
  {id:'studio',name:'Studio',cvTypes:['creative'],treatment:'portfolio',family:'creative',columns:2,accent:'#71475a',font:'sans',header:'split',sidebar:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'muse',name:'Muse',cvTypes:['creative'],treatment:'editorial',family:'creative',columns:1,accent:'#795364',font:'serif',header:'left',density:'comfortable',sectionStyle:'line'},
  {id:'canvas',name:'Canvas',cvTypes:['creative'],treatment:'banner',family:'creative',columns:2,accent:'#955b45',font:'sans',header:'band',sidebar:'right',density:'comfortable',sectionStyle:'dot'},
  {id:'atelier',name:'Atelier',cvTypes:['creative'],treatment:'frame',family:'creative',columns:1,accent:'#75644d',font:'serif',header:'split',density:'comfortable',sectionStyle:'bar'},
  {id:'composition',name:'Composition',cvTypes:['creative'],treatment:'portfolio',family:'creative',columns:1,accent:'#586275',font:'sans',header:'center',density:'comfortable',sectionStyle:'line'},
];

/** Each edition changes document geometry or content placement, not just its color. */
const EDITIONS: {id: TemplateLayoutVariant; name: string; sidebarWidth?:25|29|33; pageInset?:'standard'|'narrow'|'generous'}[] = [
  {id:'standard',name:''},
  {id:'contact-strip',name:'Contact',sidebarWidth:25,pageInset:'narrow'},
  {id:'split-masthead',name:'Signature',sidebarWidth:29,pageInset:'standard'},
  {id:'label-column',name:'Index',sidebarWidth:25,pageInset:'generous'},
  {id:'inset-heading',name:'Inset',sidebarWidth:29,pageInset:'standard'},
  {id:'top-rule',name:'Prelude',sidebarWidth:33,pageInset:'narrow'},
  {id:'centered-labels',name:'Balance',sidebarWidth:25,pageInset:'generous'},
  {id:'section-panels',name:'Panels',sidebarWidth:29,pageInset:'narrow'},
  {id:'date-column',name:'Chronicle',sidebarWidth:25,pageInset:'standard'},
  {id:'bordered-header',name:'Outline',sidebarWidth:33,pageInset:'generous'},
];

// Forty original foundations, ten structural editions each: fifty per CV type.
// Standard IDs stay stable so existing selections and shared links keep working.
const COLLECTION_TYPES = [...new Set(FOUNDATIONS.flatMap(foundation => foundation.cvTypes))];
// Eight light paper tones and two white slots keep forty pastel and ten classic
// white designs in each collection. Geometry, accents and existing IDs stay put.
const PAPER_BACKGROUNDS = ['#ffffff','#fbe8ed','#e8f0fb','#eee8f8','#e7f3ee','#ffffff','#faf0de','#faeadd','#ebeff4','#edf3e4'];
export const TEMPLATES: TemplateDefinition[] = COLLECTION_TYPES.flatMap(type => EDITIONS.flatMap((edition,editionIndex) => FOUNDATIONS.filter(foundation => foundation.cvTypes.includes(type)).map((foundation,foundationIndex) => ({
  ...foundation,
  id:edition.id==='standard' ? foundation.id : `${foundation.id}--${edition.id}`,
  name:edition.name ? `${foundation.name} ${foundation.name===edition.name ? (edition.id==='date-column'?'Sequence':'Reference') : edition.name}` : foundation.name,
  layoutVariant:edition.id,
  pageBackground:PAPER_BACKGROUNDS[(foundationIndex+editionIndex*3)%PAPER_BACKGROUNDS.length],
  ...(edition.sidebarWidth && foundation.columns===2 ? {sidebarWidth:edition.sidebarWidth} : {}),
  ...(edition.pageInset ? {pageInset:edition.pageInset} : {}),
}))));

export const getTemplatesForType = (type: CvType): TemplateDefinition[] => TEMPLATES.filter(template => template.cvTypes.includes(type));
export const getTemplate = (id: string): TemplateDefinition => TEMPLATES.find(template => template.id === id) ?? TEMPLATES[0];

/** Contrast-aware foreground for a user-selected masthead or rail color. */
export function accentTextColor(accent: string): '#ffffff' | '#000000' {
  const hex = /^#[\da-f]{6}$/i.test(accent) ? accent.slice(1) : '244b52';
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

/** Keep accent text readable on the selected paper, including neon accents. */
export function accentInkColor(accent: string, background = '#ffffff'): string {
  const hex = /^#[\da-f]{6}$/i.test(accent) ? accent : '#244b52';
  const rgb = [1,3,5].map(offset => parseInt(hex.slice(offset,offset+2),16));
  const luminance = (factor: number) => rgb.reduce((total,channel,index) => {
    const scaled = Math.floor(channel*factor)/255;
    const linear = scaled <= 0.04045 ? scaled/12.92 : ((scaled+0.055)/1.055)**2.4;
    return total + linear * [0.2126,0.7152,0.0722][index];
  },0);
  const paper = /^#[\da-f]{6}$/i.test(background) ? background : '#ffffff';
  const paperLuminance = [1,3,5].reduce((total,offset,index) => {
    const channel = parseInt(paper.slice(offset,offset+2),16)/255;
    const linear = channel <= 0.04045 ? channel/12.92 : ((channel+0.055)/1.055)**2.4;
    return total + linear * [0.2126,0.7152,0.0722][index];
  },0);
  const limit = Math.min(0.18,(paperLuminance+0.05)/4.5-0.05);
  if (luminance(1) <= limit) return hex;
  let low = 0, high = 1;
  for (let iteration=0;iteration<16;iteration++) {
    const midpoint = (low+high)/2;
    if (luminance(midpoint)>limit) high=midpoint; else low=midpoint;
  }
  return `#${rgb.map(channel=>Math.floor(channel*low).toString(16).padStart(2,'0')).join('')}`;
}
