import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useResume } from './state';
import { t } from './i18n';
import { sampleResume, type TemplateDefinition } from './model';
import { TEMPLATES } from './templates';
import { Button, PageHeading, ScaledResume } from './components/UI';

export function TemplatesPage() {
  const {locale,data,settings,setSettings,started}=useResume();const navigate=useNavigate();
  const [filter,setFilter]=useState<'all'|TemplateDefinition['family']>('all');
  const displayed=TEMPLATES.filter(template=>filter==='all'||template.family===filter);
  const content=started&&data.personal.name.trim()?data:sampleResume(locale);
  const choose=(template:TemplateDefinition)=>{setSettings(previous=>({...previous,templateId:template.id,accent:template.accent}));if(started)navigate(data.personal.name.trim()?'/review':'/builder/personal');else window.location.assign(`/language?template=${template.id}`);};
  return <main id="main" className="public-content templates-page"><PageHeading eyebrow={t(locale,'templatesEyebrow')} title={t(locale,'templatesTitle')} description={t(locale,'templatesDescription')}/><div className="template-toolbar"><div className="template-filters" role="group" aria-label={t(locale,'template')}><SlidersHorizontal size={16}/>{(['all','classic','modern','executive','technical','creative','academic'] as const).map(family=><Button key={family} variant="ghost" aria-pressed={filter===family} className={filter===family?'active':''} onClick={()=>setFilter(family)}>{t(locale,family==='all'?'templateAll':`family${family[0].toUpperCase()+family.slice(1)}`)}</Button>)}</div><span className="template-count">{t(locale,'templateCount',{count:displayed.length})}</span></div><p className="catalog-note">{t(locale,started&&data.personal.name.trim()?'templatesYourData':'templatesSample')}</p><div className="template-grid">{displayed.map((template,index)=><article className={`template-card ${settings.templateId===template.id&&started?'selected':''}`} key={template.id}><button type="button" className="template-preview-button" onClick={()=>choose(template)} aria-label={`${t(locale,'useTemplate')}: ${template.name}`}><div className="template-canvas"><ScaledResume thumbnail data={content} settings={{...settings,templateId:template.id,accent:template.accent,paper:'A4',fontSize:10}}/></div><span className="template-hover"><span>{t(locale,'useTemplate')}<ArrowUpRight size={16}/></span></span></button><div className="template-info"><div><span className="template-index">{String(index+1).padStart(2,'0')}</span><h2>{template.name}</h2><p>{t(locale,`family${template.family[0].toUpperCase()+template.family.slice(1)}`)} · {t(locale,template.columns===1?'oneColumn':'twoColumns')}</p></div><Button variant="ghost" aria-label={`${t(locale,'useTemplate')}: ${template.name}`} onClick={()=>choose(template)}>{settings.templateId===template.id&&started?<Check size={18}/>:<ArrowUpRight size={18}/>}</Button></div></article>)}</div><p className="field-hint template-ats-note">{t(locale,'templateAccessible')}</p>{started&&<Link className="button secondary" to="/builder/summary"><ArrowLeft size={17}/>{t(locale,'templateBack')}</Link>}</main>;
}
