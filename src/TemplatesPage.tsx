import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, SlidersHorizontal } from 'lucide-react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useResume } from './state';
import { t } from './i18n';
import { sampleResume, type CvType, type TemplateDefinition } from './model';
import { TEMPLATES, getTemplatesForType } from './templates';
import { CV_TYPES, getCvType } from './cv-types';
import { Button, PageHeading, ScaledResume } from './components/UI';

export function TemplatesPage(){
  const {locale,data,settings,started,typeChosen,chooseDesign}=useResume();
  const navigate=useNavigate();const [search]=useSearchParams();
  const designStep=search.get('step')==='design';
  const [filter,setFilter]=useState<CvType|'all'>('all');
  if(designStep&&!started)return <Navigate to="/language" replace/>;
  if(started&&!typeChosen)return <Navigate to="/cv-type" replace/>;
  const activeType=started?settings.cvType:filter==='all'?null:filter;
  const selectedType=activeType?getCvType(activeType):null;
  const displayed=activeType?getTemplatesForType(activeType):TEMPLATES;
  const ownData=started&&!!data.personal.name.trim();
  const content=ownData?data:sampleResume(locale);
  const choose=(template:TemplateDefinition)=>{
    if(!started){window.location.assign(`/language?template=${template.id}`);return;}
    chooseDesign(template.id);
    navigate(ownData?'/review':'/profile');
  };
  return <main id="main" className={`public-content templates-page ${designStep?'design-selection-step':''}`}>
    <PageHeading eyebrow={t(locale,designStep?'designStepEyebrow':'templatesEyebrow')} title={t(locale,'templatesTitle')} description={t(locale,designStep?'designStepDescription':'templatesDescription')}/>
    {selectedType&&<div className="catalog-context"><div><span className="type-chip">{t(locale,'cvTypeCurrent')}</span><h2>{t(locale,selectedType.nameKey)}</h2><p>{t(locale,selectedType.descriptionKey)}</p></div>{started&&<Link className="text-link" to="/cv-type">{t(locale,'cvTypeChange')}<ArrowUpRight size={15}/></Link>}</div>}
    <div className="template-toolbar">
      {!started&&<div className="template-filters template-type-filters" role="group" aria-label={t(locale,'cvTypeCurrent')}><SlidersHorizontal size={16}/><Button variant="ghost" data-cv-filter="all" aria-pressed={filter==='all'} className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>{t(locale,'designFilterAll')}</Button>{CV_TYPES.map(type=><Button key={type.id} variant="ghost" data-cv-filter={type.id} aria-pressed={filter===type.id} className={filter===type.id?'active':''} onClick={()=>setFilter(type.id)}>{t(locale,type.nameKey)}</Button>)}</div>}
      <span className="template-count">{t(locale,'templateCount',{count:displayed.length})}</span>
    </div>
    <p className="catalog-note">{t(locale,ownData?'templatesYourData':'templatesSample')}</p>
    <div className="template-grid">{displayed.map((template,index)=>{
      const type=getCvType(activeType||template.cvTypes[0]);
      return <article className={`template-card ${settings.templateId===template.id&&started?'selected':''}`} data-template-id={template.id} data-template-cv-type={type.id} key={template.id}>
        <button type="button" className="template-preview-button" onClick={()=>choose(template)} aria-label={`${t(locale,designStep?'designChooseAction':'useTemplate')}: ${template.name}`}>
          <div className="template-canvas"><ScaledResume thumbnail data={content} settings={{...settings,cvType:type.id,templateId:template.id,accent:template.accent,paper:'A4',fontSize:10}}/></div>
          <span className="template-hover"><span>{t(locale,designStep?'designChooseAction':'useTemplate')}<ArrowUpRight size={16}/></span></span>
        </button>
        <div className="template-info"><div><span className="template-index">{String(index+1).padStart(2,'0')}</span><h2>{template.name}</h2><p className="template-treatment-label">{t(locale,type.nameKey)}</p><p className="template-format-chip">{t(locale,template.columns===1?'oneColumn':'twoColumns')}</p></div><Button variant="ghost" aria-label={`${t(locale,designStep?'designChooseAction':'useTemplate')}: ${template.name}`} onClick={()=>choose(template)}>{settings.templateId===template.id&&started?<Check size={18}/>:<ArrowUpRight size={18}/>}</Button></div>
      </article>;
    })}</div>
    <p className="field-hint template-ats-note">{t(locale,'templateAccessible')}</p>
    {designStep&&<div className="form-actions"><Link className="button ghost" to="/cv-type"><ArrowLeft size={17}/>{t(locale,'back')}</Link><Button variant="primary" onClick={()=>choose(TEMPLATES.find(template=>template.id===settings.templateId)!)}>{t(locale,'designContinue')}<Check size={17}/></Button></div>}
    {started&&!designStep&&<Link className="button secondary" to={ownData?'/review':'/profile'}><ArrowLeft size={17}/>{t(locale,'back')}</Link>}
  </main>;
}
