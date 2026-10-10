import type { CvType, TemplateDefinition } from './model';

/** Original CVonline compositions: no university endorsement or official Europass artwork. */
export const TEMPLATES: TemplateDefinition[] = [
  // Harvard-inspired: restrained typography, generous margins, readable rules.
  {id:'folio',name:'Cambridge',cvTypes:['harvard'],treatment:'formal',family:'classic',columns:1,accent:'#262626',font:'serif',header:'center',density:'comfortable',sectionStyle:'line'},
  {id:'quincy',name:'Quincy',cvTypes:['harvard'],treatment:'frame',family:'classic',columns:1,accent:'#30343b',font:'serif',header:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'beacon',name:'Beacon',cvTypes:['harvard'],treatment:'ledger',family:'classic',columns:1,accent:'#202831',font:'sans',header:'minimal',density:'compact',sectionStyle:'line'},
  // Chronological: career progression is the central visual narrative.
  {id:'atlas',name:'Atlas',cvTypes:['chronological'],treatment:'timeline',family:'modern',columns:1,accent:'#245d69',font:'sans',header:'split',density:'comfortable',sectionStyle:'caps'},
  {id:'prism',name:'Prism',cvTypes:['chronological'],treatment:'rail',family:'modern',columns:2,accent:'#244b52',font:'sans',header:'left',sidebar:'left',density:'comfortable',sectionStyle:'line'},
  {id:'monarch',name:'Monarch',cvTypes:['chronological'],treatment:'editorial',family:'executive',columns:1,accent:'#7c623b',font:'serif',header:'left',density:'comfortable',sectionStyle:'line'},
  // Functional: transferable competencies and evidence precede job dates.
  {id:'focus',name:'Focus',cvTypes:['functional'],treatment:'ledger',family:'modern',columns:1,accent:'#385f69',font:'sans',header:'split',density:'comfortable',sectionStyle:'caps'},
  {id:'bridge',name:'Bridge',cvTypes:['functional'],treatment:'rail',family:'executive',columns:2,accent:'#3b4651',font:'sans',header:'left',sidebar:'right',density:'comfortable',sectionStyle:'caps'},
  {id:'momentum',name:'Momentum',cvTypes:['functional'],treatment:'frame',family:'modern',columns:1,accent:'#62705d',font:'sans',header:'left',density:'comfortable',sectionStyle:'bar'},
  // Combination: a competency overview followed by a dated career record.
  {id:'summit',name:'Summit',cvTypes:['combination'],treatment:'banner',family:'executive',columns:2,accent:'#675239',font:'sans',header:'band',sidebar:'right',density:'comfortable',sectionStyle:'caps'},
  {id:'nexus',name:'Nexus',cvTypes:['combination'],treatment:'ledger',family:'modern',columns:1,accent:'#334d71',font:'sans',header:'minimal',density:'comfortable',sectionStyle:'line'},
  {id:'regent',name:'Regent',cvTypes:['combination'],treatment:'editorial',family:'executive',columns:2,accent:'#6b544c',font:'serif',header:'left',sidebar:'right',density:'comfortable',sectionStyle:'line'},
  // Academic: education, research and user-supplied publications lead.
  {id:'scholar',name:'Scholar',cvTypes:['academic'],treatment:'formal',family:'academic',columns:1,accent:'#283b53',font:'serif',header:'center',density:'comfortable',sectionStyle:'line'},
  {id:'index',name:'Index',cvTypes:['academic'],treatment:'ledger',family:'academic',columns:1,accent:'#51485f',font:'serif',header:'left',density:'compact',sectionStyle:'line'},
  {id:'archive',name:'Archive',cvTypes:['academic'],treatment:'frame',family:'academic',columns:1,accent:'#555b50',font:'serif',header:'minimal',density:'comfortable',sectionStyle:'caps'},
  // European-inspired: consistent labels and prominent language information.
  {id:'europa',name:'Europa',cvTypes:['european'],treatment:'rail',family:'modern',columns:2,accent:'#234f7f',font:'sans',header:'left',sidebar:'left',density:'comfortable',sectionStyle:'line'},
  {id:'continental',name:'Continental',cvTypes:['european'],treatment:'banner',family:'classic',columns:1,accent:'#234f7f',font:'sans',header:'band',density:'comfortable',sectionStyle:'line'},
  {id:'meridian',name:'Meridian',cvTypes:['european'],treatment:'timeline',family:'modern',columns:1,accent:'#305f8f',font:'sans',header:'split',density:'comfortable',sectionStyle:'line'},
  // Technical: capabilities and projects stay in the main reading column.
  {id:'signal',name:'Signal',cvTypes:['technical'],treatment:'ledger',family:'technical',columns:1,accent:'#31576c',font:'sans',header:'minimal',density:'compact',sectionStyle:'caps'},
  {id:'orbit',name:'Orbit',cvTypes:['technical'],treatment:'rail',family:'technical',columns:2,accent:'#283b55',font:'sans',header:'left',sidebar:'right',density:'comfortable',sectionStyle:'caps'},
  {id:'vector',name:'Vector',cvTypes:['technical'],treatment:'frame',family:'technical',columns:1,accent:'#3d6666',font:'sans',header:'split',density:'comfortable',sectionStyle:'bar'},
  // Creative: portfolio evidence, typography and intentional asymmetry.
  {id:'studio',name:'Studio',cvTypes:['creative'],treatment:'portfolio',family:'creative',columns:2,accent:'#71475a',font:'sans',header:'split',sidebar:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'muse',name:'Muse',cvTypes:['creative'],treatment:'editorial',family:'creative',columns:1,accent:'#795364',font:'serif',header:'left',density:'comfortable',sectionStyle:'line'},
  {id:'canvas',name:'Canvas',cvTypes:['creative'],treatment:'banner',family:'creative',columns:2,accent:'#955b45',font:'sans',header:'band',sidebar:'right',density:'comfortable',sectionStyle:'dot'},
];

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

/** Keep accent text readable on white, including white/neon custom accents. */
export function accentInkColor(accent: string): string {
  const hex = /^#[\da-f]{6}$/i.test(accent) ? accent : '#244b52';
  const rgb = [1,3,5].map(offset => parseInt(hex.slice(offset,offset+2),16));
  const luminance = (factor: number) => rgb.reduce((total,channel,index) => {
    const scaled = Math.floor(channel*factor)/255;
    const linear = scaled <= 0.04045 ? scaled/12.92 : ((scaled+0.055)/1.055)**2.4;
    return total + linear * [0.2126,0.7152,0.0722][index];
  },0);
  // White against 0.18 luminance has a contrast ratio above 4.5:1.
  if (luminance(1) <= 0.18) return hex;
  let low = 0, high = 1;
  for (let iteration=0;iteration<16;iteration++) {
    const midpoint = (low+high)/2;
    if (luminance(midpoint)>0.18) high=midpoint; else low=midpoint;
  }
  return `#${rgb.map(channel=>Math.floor(channel*low).toString(16).padStart(2,'0')).join('')}`;
}
