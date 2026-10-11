import type { CSSProperties } from 'react';
import type { ResumeData, ResumeSettings, TemplateLayoutVariant } from './model';
import { getResumeFont } from './fonts';
import { accentInkColor, accentTextColor, getTemplate } from './templates';
import { contactItems, resumeLabels, resumeSections, safeAccent, safeFontSize, type ResumeSection } from './resume-text';
import './resume.css';

export interface ResumePreviewProps {data:ResumeData;settings:ResumeSettings;compact?:boolean}

function Section({section,ordinal,numbered=false,layoutVariant}: {section:ResumeSection;ordinal:number;numbered?:boolean;layoutVariant:TemplateLayoutVariant}) {
  const tags = section.id === 'skills' || section.id === 'interests';
  const style = {'--resume-entry-count':tags ? 1 : Math.max(1,section.entries.length)} as CSSProperties;
  return <section className={`resume-section resume-section-${section.id}`} style={style}>
    <h2>{numbered && <span className="resume-section-number" aria-hidden="true">{String(ordinal).padStart(2,'0')}</span>}<span className="resume-section-title">{section.title}</span></h2>
    {tags ? <div className="resume-tags">{section.entries.map((entry,index) => <span key={index}>{entry.body}</span>)}</div> : section.entries.map((entry,index) => {
      const dateColumn = layoutVariant === 'date-column' && !!entry.date;
      const content = <>
        {(entry.title || (entry.date && !dateColumn)) && <div className="resume-entry-top">{entry.title && <h3>{entry.title}</h3>}{entry.date && !dateColumn && <span className="resume-date">{entry.date}</span>}</div>}
        {entry.subtitle && <p className="resume-subtitle">{entry.subtitle}</p>}
        {entry.body && <p className="resume-body-text">{entry.body}</p>}
        {!!entry.bullets?.length && <ul>{entry.bullets.map((bullet,bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>}
        {entry.linkText && (entry.link ? <a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.linkText}</a> : <span className="resume-link">{entry.linkText}</span>)}
      </>;
      return <div className={`resume-entry ${entry.date?'resume-entry-dated':''}`} key={index}>
        {dateColumn ? <><span className="resume-date resume-date-gutter">{entry.date}</span><div className="resume-entry-content">{content}</div></> : content}
      </div>;
    })}
  </section>;
}

export function ResumePreview({data,settings,compact=false}:ResumePreviewProps) {
  const template = getTemplate(settings.templateId);
  const labels = resumeLabels(settings.locale);
  const sections = resumeSections(data,settings);
  const contacts = contactItems(data);
  const photo = settings.showPhoto && data.personal.photo && /^data:image\/(?:png|jpe?g|webp);base64,/i.test(data.personal.photo) ? data.personal.photo : undefined;
  const accent = safeAccent(settings.accent,template.accent);
  const font = getResumeFont(settings.fontFamily,template.font);
  const style = {
    '--resume-accent':accent,
    '--resume-paper-background':template.pageBackground,
    '--resume-ink-accent':accentInkColor(accent,template.pageBackground),
    '--resume-accent-text':accentTextColor(accent),
    '--resume-font-size':`${safeFontSize(settings.fontSize)}pt`,
    '--resume-font-family':font.fontCSS,
    ...(template.sidebarWidth ? {'--resume-sidebar-width':`${template.sidebarWidth}%`} : {}),
  } as CSSProperties;
  const auxiliary = sections.filter(section => section.auxiliary);
  const main = sections.filter(section => !section.auxiliary);
  const contactBlock = <address className="resume-contact">{contacts.map((item,index) => item.href ? <a key={index} href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a> : <span key={index}>{item.text}</span>)}</address>;
  const rail = template.treatment === 'rail' && template.columns === 2;
  const numbered = template.treatment === 'ledger';
  const contactStrip = template.layoutVariant === 'contact-strip';
  const splitMasthead = template.layoutVariant === 'split-masthead';
  const topHeadline = template.layoutVariant === 'top-rule';
  const contactsInMasthead = contactStrip || splitMasthead;
  const renderSection = (section:ResumeSection) => <Section section={section} ordinal={sections.indexOf(section)+1} numbered={numbered} layoutVariant={template.layoutVariant} key={section.id}/>;
  const headline = data.personal.headline && <p className={`resume-headline ${topHeadline?'resume-headline-top':''}`}>{data.personal.headline}</p>;
  const header = <header className="resume-header">
    <div className="resume-identity">{topHeadline && headline}<h1>{data.personal.name || labels.name}</h1>{!topHeadline && headline}{template.columns === 1 && !contactsInMasthead && contactBlock}</div>
    {splitMasthead ? <div className="resume-masthead-details">{photo && <img className="resume-photo" src={photo} alt={data.personal.name || labels.name} />}{contactBlock}</div> : photo && !rail && <img className="resume-photo" src={photo} alt={data.personal.name || labels.name} />}
  </header>;
  const strip = contactStrip && !!contacts.length && <div className="resume-contact-strip">{contactBlock}</div>;
  const foundationId = template.id.split('--')[0];
  return <article lang={settings.locale} data-template={template.id} data-treatment={template.treatment} data-layout={template.layoutVariant} style={style} className={`resume-page resume-${template.id} ${foundationId!==template.id?`resume-${foundationId}`:''} resume-type-${settings.cvType} resume-treatment-${template.treatment} resume-layout-${template.layoutVariant} resume-inset-${template.pageInset ?? 'standard'} resume-font-${template.font} ${font.id!=='auto'?'resume-font-custom':''} resume-header-${template.header} resume-cols-${template.columns} resume-sidebar-${template.sidebar ?? 'none'} ${template.sidebarWidth?'resume-sidebar-sized':''} resume-sections-${template.sectionStyle} resume-density-${template.density} resume-paper-${settings.paper.toLowerCase()} ${compact?'resume-compact':''}`}>
    {!rail && <>{strip}{header}</>}
    <div className="resume-columns">
      {template.columns === 2 ? <>
        <div className="resume-main">{rail && <>{strip}{header}</>}{main.map(renderSection)}</div>
        <aside className="resume-aside">{photo && rail && !splitMasthead && <img className="resume-photo resume-rail-photo" src={photo} alt={data.personal.name || labels.name} />}{!!contacts.length && !contactsInMasthead && <section className="resume-section resume-section-contact"><h2><span className="resume-section-title">{labels.contact}</span></h2>{contactBlock}</section>}{auxiliary.map(renderSection)}</aside>
      </> : <div className="resume-main">{sections.map(renderSection)}</div>}
    </div>
  </article>;
}
export default ResumePreview;
