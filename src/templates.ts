import type { TemplateDefinition } from './model';

/** Original CVonline layouts. No third-party template artwork is used. */
export const TEMPLATES: TemplateDefinition[] = [
  {id:'atlas',name:'Atlas',family:'modern',columns:1,accent:'#145b64',font:'sans',header:'left',density:'comfortable',sectionStyle:'line'},
  {id:'folio',name:'Folio',family:'classic',columns:1,accent:'#27313c',font:'serif',header:'center',density:'comfortable',sectionStyle:'line'},
  {id:'monarch',name:'Monarch',family:'executive',columns:1,accent:'#8b692f',font:'serif',header:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'signal',name:'Signal',family:'technical',columns:1,accent:'#315a80',font:'sans',header:'minimal',density:'compact',sectionStyle:'caps'},
  {id:'muse',name:'Muse',family:'creative',columns:1,accent:'#725065',font:'serif',header:'band',density:'comfortable',sectionStyle:'dot'},
  {id:'scholar',name:'Scholar',family:'academic',columns:1,accent:'#38495e',font:'serif',header:'center',density:'compact',sectionStyle:'line'},
  {id:'outline',name:'Outline',family:'classic',columns:1,accent:'#323232',font:'sans',header:'minimal',density:'compact',sectionStyle:'line'},
  {id:'vertex',name:'Vertex',family:'modern',columns:1,accent:'#3c527d',font:'sans',header:'split',density:'comfortable',sectionStyle:'bar'},
  {id:'regent',name:'Regent',family:'executive',columns:1,accent:'#715740',font:'serif',header:'band',density:'compact',sectionStyle:'line'},
  {id:'prism',name:'Prism',family:'modern',columns:2,accent:'#1d6669',font:'sans',header:'left',sidebar:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'studio',name:'Studio',family:'creative',columns:2,accent:'#865569',font:'sans',header:'band',sidebar:'left',density:'comfortable',sectionStyle:'dot'},
  {id:'orbit',name:'Orbit',family:'technical',columns:2,accent:'#344f83',font:'sans',header:'split',sidebar:'right',density:'compact',sectionStyle:'bar'},
  {id:'heritage',name:'Heritage',family:'classic',columns:2,accent:'#555a4b',font:'serif',header:'center',sidebar:'right',density:'comfortable',sectionStyle:'line'},
  {id:'summit',name:'Summit',family:'executive',columns:2,accent:'#846126',font:'sans',header:'band',sidebar:'left',density:'comfortable',sectionStyle:'caps'},
  {id:'nova',name:'Nova',family:'modern',columns:2,accent:'#2e6482',font:'sans',header:'minimal',sidebar:'right',density:'comfortable',sectionStyle:'dot'},
  {id:'index',name:'Index',family:'academic',columns:2,accent:'#63517a',font:'serif',header:'left',sidebar:'left',density:'compact',sectionStyle:'line'},
  {id:'canvas',name:'Canvas',family:'creative',columns:2,accent:'#9a5140',font:'sans',header:'split',sidebar:'right',density:'comfortable',sectionStyle:'bar'},
];

export const getTemplate = (id: string): TemplateDefinition => TEMPLATES.find(template => template.id === id) ?? TEMPLATES[0];
