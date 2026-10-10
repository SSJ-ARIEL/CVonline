import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { emptyResume, LOCALES, type Locale, type ResumeData, type ResumeSettings } from './model';
import { TEMPLATES } from './templates';

interface ResumeState {
  data: ResumeData;
  setData: Dispatch<SetStateAction<ResumeData>>;
  settings: ResumeSettings;
  setSettings: Dispatch<SetStateAction<ResumeSettings>>;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  started: boolean;
  start: () => void;
  reset: () => void;
}
const Context = createContext<ResumeState | null>(null);
const initialSettings = (locale: Locale): ResumeSettings => ({locale,templateId:TEMPLATES[0].id,accent:TEMPLATES[0].accent,paper:'A4',showPhoto:true,fontSize:10});
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
      if (template) { settings.templateId = template.id; settings.accent = template.accent; }
    }
    return settings;
  });
  const [started,setStarted] = useState(false);
  const setLocale = (locale:Locale) => setSettings(previous => ({...previous,locale}));
  const reset = () => { setData(emptyResume());setStarted(false);setSettings(previous => initialSettings(previous.locale)); };
  return <Context.Provider value={{data,setData,settings,setSettings,locale:settings.locale,setLocale,started,start:()=>setStarted(true),reset}}>{children}</Context.Provider>;
}
export function useResume() { const value = useContext(Context);if (!value) throw new Error('ResumeProvider is required');return value; }
export function publicPath(path:string,locale:Locale) { return locale === 'es' ? path : `/${locale}${path === '/' ? '' : path}`; }
