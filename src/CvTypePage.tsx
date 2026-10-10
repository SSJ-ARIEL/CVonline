import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, Check, Code2, Globe2, GraduationCap, Layers3, Palette, Sparkles } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { type CvType } from './model';
import { CV_TYPES } from './cv-types';
import { useResume } from './state';
import { t } from './i18n';
import { Button, PageHeading } from './components/UI';

const icons={graduation:GraduationCap,briefcase:BriefcaseBusiness,sparkles:Sparkles,layers:Layers3,book:BookOpen,globe:Globe2,code:Code2,palette:Palette};

export function CvTypePage(){
  const {locale,settings,started,chooseCvType}=useResume();
  const [selected,setSelected]=useState<CvType>(settings.cvType);
  const navigate=useNavigate();
  if(!started)return <Navigate to="/language" replace/>;
  const continueToDesigns=()=>{chooseCvType(selected);navigate('/templates?step=design');};
  return <main id="main" className="flow-shell cv-type-page">
    <PageHeading eyebrow={t(locale,'cvTypeEyebrow')} title={t(locale,'cvTypeTitle')} description={t(locale,'cvTypeDescription')}/>
    <div className="cv-type-grid" role="group" aria-label={t(locale,'cvTypeTitle')}>
      {CV_TYPES.map(type=>{
        const Icon=icons[type.icon];
        return <button type="button" key={type.id} data-cv-type={type.id} className={`cv-type-card ${selected===type.id?'selected':''}`} aria-pressed={selected===type.id} onClick={()=>setSelected(type.id)}>
          <span className="cv-type-icon"><Icon size={22} aria-hidden="true"/></span>
          <h2 className="cv-type-heading">{t(locale,type.nameKey)}</h2>
          <p className="cv-type-description">{t(locale,type.descriptionKey)}</p>
          <p className="cv-type-best-for"><strong>{t(locale,'cvTypeBestFor')}</strong><span>{t(locale,type.bestForKey)}</span></p>
          <div className={`cv-type-diagram diagram-${type.id}`} aria-hidden="true"><span className="diagram-header"/>{[0,1,2].map(index=><div className="diagram-section" key={index}><span className="diagram-line"/><span className="diagram-line"/></div>)}</div>
          <span className="choice-check" aria-hidden="true">{selected===type.id&&<Check size={17}/>}</span>
        </button>;
      })}
    </div>
    <p className="cv-type-source-note">{t(locale,'cvTypeReferenceNote')} <a href="https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/" target="_blank" rel="noopener noreferrer">Harvard</a> · <a href="https://capd.mit.edu/resources/resumes/" target="_blank" rel="noopener noreferrer">MIT</a> · <a href="https://europass.europa.eu/en/create-europass-cv" target="_blank" rel="noopener noreferrer">Europass</a></p>
    <div className="form-actions"><Link className="button ghost" to="/language"><ArrowLeft size={16}/>{t(locale,'back')}</Link><Button variant="primary" onClick={continueToDesigns}>{t(locale,'cvTypeAction')}<ArrowRight size={17}/></Button></div>
  </main>;
}
