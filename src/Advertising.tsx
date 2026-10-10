import { useEffect, useState } from 'react';
import { Button } from './components/UI';
import { useResume } from './state';
import { t } from './i18n';

/** Disabled by default. Configure a Google-certified consent message before enabling. */
export function Advertising() {
  const {locale,started}=useResume();const [choice,setChoice]=useState<'allow'|'decline'|null>(null);
  const client=import.meta.env.VITE_ADSENSE_CLIENT as string|undefined;
  const enabled=!started&&import.meta.env.VITE_ADSENSE_READY==='true'&&/^ca-pub-\d{16}$/.test(client||'')&&!!import.meta.env.VITE_CONTACT_EMAIL&&!!import.meta.env.VITE_OPERATOR_NAME;
  useEffect(()=>{
    if(!enabled||choice!=='allow'||!client)return;
    const script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;document.head.append(script);
    return()=>script.remove();
  },[enabled,choice,client]);
  if(!enabled||choice)return null;
  return <aside className="ads-consent"><h2>{t(locale,'adsTitle')}</h2><p>{t(locale,'adsDescription')}</p><div><Button onClick={()=>setChoice('decline')}>{t(locale,'adsDecline')}</Button><Button onClick={()=>setChoice('allow')}>{t(locale,'adsAllow')}</Button></div></aside>;
}
