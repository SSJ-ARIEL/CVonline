import { ArrowRight, ArrowUpRight, Check, FileDown, FileText, Globe2, Layers3, LockKeyhole, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useResume, publicPath } from './state';
import { t } from './i18n';
import { sampleResume } from './model';
import { getGuides } from './content';
import { PageHeading, StartLink } from './components/UI';

export function Landing() {
  const {locale}=useResume();const sample=sampleResume(locale);
  return <main id="main" className="hero">
    <div className="hero-copy"><p className="eyebrow"><span className="live-dot"/>{t(locale,'heroEyebrow')}</p><h1 className="hero-title" tabIndex={-1}>{t(locale,'heroTitle')}<br/><em>{t(locale,'heroEmphasis')}</em></h1><p className="hero-description">{t(locale,'heroDescription')}</p>
      <div className="hero-actions"><StartLink>{t(locale,'heroPrimary')}<ArrowUpRight size={20}/></StartLink><Link className="button ghost" to={publicPath('/templates',locale)}>{t(locale,'heroSecondary')}<ArrowRight size={16}/></Link></div><p className="hero-proof"><LockKeyhole size={14}/>{t(locale,'heroPrivacy')}</p>
    </div>
    <div className="hero-art" aria-hidden="true"><div className="ambient-grid"/><div className="cv-stage"><div className="stage-sheet sheet-back"/><div className="stage-sheet sheet-middle"/><div className="stage-sheet sheet-front"><div className="sheet-topline"><span>CV / 01</span><span className="sheet-monogram">AM</span></div><h2>Alex Morgan<span>{sample.personal.headline}</span></h2><p className="sheet-meta">Madrid · alex@example.com</p><div className="sheet-divider"/><h3>{t(locale,'summary')}</h3><p className="sheet-summary">{sample.summary}</p><h3>{t(locale,'stepExperience')}</h3><div className="sheet-job"><strong>{sample.experiences[0].role}</strong><span>Studio North · 2022—2026</span></div><div className="sheet-lines"><i/><i/><i/></div><h3>{t(locale,'skills')}</h3><div className="sheet-skill-row">{sample.skills.slice(0,3).map(s=><span key={s}>{s}</span>)}</div></div><div className="stage-chip chip-top"><Sparkles size={15}/>{t(locale,'heroDesignTag')}</div><div className="stage-chip chip-bottom"><span className="chip-check"><Check size={15}/></span><div><small>CVonline</small><strong>{t(locale,'heroChip')}</strong></div><ArrowUpRight size={20}/></div></div><p className="hero-art-caption">{t(locale,'heroDesignLabel')}</p></div>
    <div className="hero-bottom"><div className="feature-pill"><Layers3 size={17}/>{t(locale,'featureTemplates')}</div><div className="feature-pill"><Globe2 size={17}/>{t(locale,'featureLanguages')}</div><div className="feature-pill"><FileDown size={17}/>{t(locale,'featureDownloads')}</div></div>
  </main>;
}
export function HowItWorks() {
  const {locale}=useResume();return <main id="main" className="public-content"><PageHeading eyebrow={t(locale,'howEyebrow')} title={t(locale,'howTitle')} description={t(locale,'howIntro')}/><div className="how-grid">{[{icon:<FileText/>,title:'howStep1',body:'howStep1Body'},{icon:<Layers3/>,title:'howStep2',body:'howStep2Body'},{icon:<FileDown/>,title:'howStep3',body:'howStep3Body'}].map((step,i)=><article className="how-card" key={step.title}><span className="how-number">0{i+1}</span>{step.icon}<h2>{t(locale,step.title)}</h2><p>{t(locale,step.body)}</p></article>)}</div><StartLink>{t(locale,'heroPrimary')}<ArrowRight size={17}/></StartLink></main>;
}
export function Guides() {
  const {locale}=useResume();return <main id="main" className="public-content"><PageHeading eyebrow={t(locale,'guidesEyebrow')} title={t(locale,'guidesTitle')} description={t(locale,'guidesDescription')}/><div className="article-grid">{getGuides(locale).map((guide,i)=><Link to={publicPath(`/guides/${guide.slug}`,locale)} className="article-card" key={guide.slug}><span className="article-index">0{i+1} <span>{guide.readingTime}</span></span><h2>{guide.title}</h2><p>{guide.description}</p><span className="article-cta">{t(locale,'readGuide')}<ArrowUpRight size={18}/></span></Link>)}</div></main>;
}
export function GuidePage() {
  const {locale}=useResume();const {slug}=useParams();const guide=getGuides(locale).find(g=>g.slug===slug);
  if(!guide)return <NotFound/>;
  return <main id="main" className="public-content article-page"><Link className="text-link" to={publicPath('/guides',locale)}>← {t(locale,'guideBack')}</Link><PageHeading eyebrow={guide.readingTime} title={guide.title} description={guide.description}/><article className="article-body">{guide.sections.map(section=><section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((text,i)=><p key={i}>{text}</p>)}{section.bullets&&<ul>{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}</article><StartLink>{t(locale,'heroPrimary')}<ArrowRight size={17}/></StartLink></main>;
}
export function InformationPage({kind}:{kind:'about'|'privacy'|'terms'}) {
  const {locale}=useResume();const sections={about:['aboutIntro','aboutBody','aboutLimits'],privacy:['privacyIntro','privacySession','privacyTranslation','privacyHosting','privacyAds'],terms:['termsBody','termsAdvice','termsAvailability']}[kind];
  const contact=import.meta.env.VITE_CONTACT_EMAIL;const operator=import.meta.env.VITE_OPERATOR_NAME;
  return <main id="main" className="public-content article-page"><PageHeading eyebrow="CVonline" title={t(locale,`${kind}Title`)}/><article className="article-body">{sections.map(key=><p key={key}>{t(locale,key)}</p>)}{operator&&<p>{operator}</p>}{contact&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)&&<p><a href={`mailto:${contact}`}>{contact}</a></p>}</article><Link className="button secondary" to={publicPath('/',locale)}>{t(locale,'home')}<ArrowRight size={17}/></Link></main>;
}
export function NotFound() { const {locale}=useResume();return <main id="main" className="public-content"><PageHeading title={t(locale,'notFoundTitle')} description={t(locale,'notFoundDescription')}/><Link to={publicPath('/',locale)} className="button primary">{t(locale,'home')}<ArrowRight size={17}/></Link></main>; }
