import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { emptyResume, LOCALES, type CvType, type Locale, type ResumeData, type ResumeSettings } from './model';
import { TEMPLATES, getTemplate, getTemplatesForType } from './templates';
import { getCvType } from './cv-types';

interface ResumeState {
  data: ResumeData;
  setData: Dispatch<SetStateAction<ResumeData>>;
  settings: ResumeSettings;
  setSettings: Dispatch<SetStateAction<ResumeSettings>>;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  started: boolean;
  typeChosen: boolean;
  designChosen: boolean;
  chooseCvType: (type: CvType) => void;
  chooseDesign: (templateId: string) => void;
  start: () => void;
  reset: () => void;
}
const Context = createContext<ResumeState | null>(null);
const initialSettings = (locale: Locale): ResumeSettings => {
  const template=getTemplatesForType('chronological')[0];
  return {locale,cvType:'chronological',templateId:template.id,accent:template.accent,paper:'A4',showPhoto:getCvType('chronological').photoRecommended,fontSize:10,fontFamily:'auto'};
};
function initialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const fromPath = window.location.pathname.split('/')[1];
    if (LOCALES.some(l => l.code === fromPath)) return fromPath as Locale;
  }
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.slice(0,2);
    if (LOCALES.some(l => l.code === lang)) return lang as Locale;
  }
  return 'es';
}
export function ResumeProvider({children, initialLanguage}: {children:ReactNode;initialLanguage?:Locale}) {
  const [data,setData] = useState<ResumeData>(emptyResume);
  const [settings,setSettings] = useState<ResumeSettings>(() => {
    const settings = initialSettings(initialLanguage || initialLocale());
    if (typeof window !== 'undefined') {
      const id = new URLSearchParams(window.location.search).get('template');
      const template = TEMPLATES.find(t => t.id === id);
      if (template) { settings.templateId = template.id; settings.accent = template.accent; settings.cvType=template.cvTypes[0];settings.showPhoto=getCvType(settings.cvType).photoRecommended; }
    }
    return settings;
  });
  const [started,setStarted] = useState(false);
  const [typeChosen,setTypeChosen] = useState(false);
  const [designChosen,setDesignChosen] = useState(false);
  const chooseCvType=(cvType:CvType)=>{
    setSettings(previous=>{
      const current=getTemplate(previous.templateId);
      const template=current.cvTypes.includes(cvType)?current:getTemplatesForType(cvType)[0];
      return {...previous,cvType,templateId:template.id,accent:template.id===previous.templateId?previous.accent:template.accent,showPhoto:data.personal.photo?previous.showPhoto:getCvType(cvType).photoRecommended};
    });
    setTypeChosen(true);setDesignChosen(false);
  };
  const chooseDesign=(id:string)=>{
    const template=TEMPLATES.find(item=>item.id===id&&item.cvTypes.includes(settings.cvType));
    if(!template||!typeChosen)return;
    setSettings(previous=>({...previous,templateId:template.id,accent:template.accent}));setDesignChosen(true);
  };
  const setLocale = (locale:Locale) => setSettings(previous => ({...previous,locale}));
  const reset = () => { setData(emptyResume());setStarted(false);setTypeChosen(false);setDesignChosen(false);setSettings(previous => initialSettings(previous.locale)); };
  return <Context.Provider value={{data,setData,settings,setSettings,locale:settings.locale,setLocale,started,typeChosen,designChosen,chooseCvType,chooseDesign,start:()=>setStarted(true),reset}}>{children}</Context.Provider>;
}
export function useResume() { const value = useContext(Context);if (!value) throw new Error('ResumeProvider is required');return value; }
export function publicPath(path:string,locale:Locale) { return locale === 'es' ? path : `/${locale}${path === '/' ? '' : path}`; }
