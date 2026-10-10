import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResumePreview } from '../ResumePreview';
import type { ResumeData, ResumeSettings } from '../model';
import { useResume } from '../state';
import { t } from '../i18n';

export function Button({children,variant='secondary',className='',type='button',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'ghost';children:ReactNode}) {
  return <button type={type} className={`button ${variant} ${className}`} {...props}>{children}</button>;
}
export function PageHeading({eyebrow,title,description}:{eyebrow?:string;title:string;description?:string}) {
  return <div className="step-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1 tabIndex={-1}>{title}</h1>{description && <p>{description}</p>}</div>;
}
type BaseField = {label:string;hint?:string;error?:string;wide?:boolean;optional?:boolean};
export function InputField({label,hint,error,wide,optional,onValueChange,id:givenId,...props}:Omit<InputHTMLAttributes<HTMLInputElement>,'onChange'>&BaseField&{onValueChange:(value:string)=>void}) {
  const generated = useId();const id=givenId||generated;const {locale}=useResume();
  return <div className={`field ${wide?'field-full':''}`}><label htmlFor={id}>{label}{optional && <span>{t(locale,'optional')}</span>}</label><input id={id} {...props} onChange={e=>onValueChange(e.target.value)} aria-invalid={!!error} aria-describedby={error?`${id}-error`:hint?`${id}-hint`:undefined}/>{hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}{error && <p className="error-text" id={`${id}-error`} role="alert">{error}</p>}</div>;
}
export function TextareaField({label,hint,error,wide=true,optional,onValueChange,id:givenId,...props}:Omit<TextareaHTMLAttributes<HTMLTextAreaElement>,'onChange'>&BaseField&{onValueChange:(value:string)=>void}) {
  const generated=useId();const id=givenId||generated;const {locale}=useResume();
  return <div className={`field ${wide?'field-full':''}`}><label htmlFor={id}>{label}{optional&&<span>{t(locale,'optional')}</span>}</label><textarea id={id} rows={4} {...props} onChange={e=>onValueChange(e.target.value)} aria-invalid={!!error} aria-describedby={error?`${id}-error`:hint?`${id}-hint`:undefined}/>{hint&&<p className="field-hint" id={`${id}-hint`}>{hint}</p>}{error&&<p className="error-text" id={`${id}-error`} role="alert">{error}</p>}</div>;
}
export function HelpCard({title,children}:{title:string;children:ReactNode}) { return <aside className="help-card"><Sparkles size={19}/><h3>{title}</h3><div>{children}</div></aside>; }
export function NextButton({label,disabled}:{label?:string;disabled?:boolean}) { const {locale}=useResume();return <Button type="submit" variant="primary" disabled={disabled}>{label||t(locale,'next')}<ArrowRight size={17}/></Button>; }
export function focusFirstError() { requestAnimationFrame(()=>document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); }
export function StartLink({children,className='button primary'}:{children:ReactNode;className?:string}) {
  const {started}=useResume();
  return started?<Link className={className} to="/builder/personal">{children}</Link>:<a className={className} href="/language">{children}</a>;
}
export function ScaledResume({data,settings,thumbnail=false}:{data:ResumeData;settings:ResumeSettings;thumbnail?:boolean}) {
  const wrapper=useRef<HTMLDivElement>(null);const paper=useRef<HTMLDivElement>(null);
  const nativeWidth=settings.paper==='LETTER'?816:794;
  const [size,setSize]=useState({scale:thumbnail?.28:.7,height:thumbnail?300:790});
  useEffect(()=>{
    const update=()=>{ if(!wrapper.current||!paper.current)return;const scale=Math.min(1,wrapper.current.clientWidth/nativeWidth);setSize({scale,height:paper.current.scrollHeight*scale}); };
    const observer=new ResizeObserver(update);if(wrapper.current)observer.observe(wrapper.current);if(paper.current)observer.observe(paper.current);update();return()=>observer.disconnect();
  },[nativeWidth,data,settings,thumbnail]);
  return <div className={`scaled-resume ${thumbnail?'is-thumbnail':''}`} ref={wrapper} style={{position:'relative',height:thumbnail?undefined:size.height,overflow:'hidden'}}><div className="scaled-content" ref={paper} style={{width:nativeWidth,transform:`scale(${size.scale})`,transformOrigin:'top left',position:'absolute',top:0,left:0}}><ResumePreview data={data} settings={settings} compact={thumbnail}/></div></div>;
}
