import type { CSSProperties } from 'react';
import type { ResumeData, ResumeSettings } from './model';
import { getTemplate } from './templates';
import { contactItems, resumeLabels, resumeSections, safeAccent, safeFontSize, type ResumeSection } from './resume-text';
import './resume.css';

export interface ResumePreviewProps {data:ResumeData;settings:ResumeSettings;compact?:boolean}

function Section({section}: {section:ResumeSection}) {
  return <section className={`resume-section resume-section-${section.id}`}>
    <h2>{section.title}</h2>
    {section.id === 'skills' || section.id === 'interests' ? <div className="resume-tags">{section.entries.map((entry,index) => <span key={index}>{entry.body}</span>)}</div> : section.entries.map((entry,index) => <div className="resume-entry" key={index}>
      {(entry.title || entry.date) && <div className="resume-entry-top">{entry.title && <h3>{entry.title}</h3>}{entry.date && <span className="resume-date">{entry.date}</span>}</div>}
      {entry.subtitle && <p className="resume-subtitle">{entry.subtitle}</p>}
      {entry.body && <p className="resume-body-text">{entry.body}</p>}
      {!!entry.bullets?.length && <ul>{entry.bullets.map((bullet,bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>}
      {entry.linkText && (entry.link ? <a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.linkText}</a> : <span className="resume-link">{entry.linkText}</span>)}
    </div>)}
  </section>;
}

export function ResumePreview({data,settings,compact=false}:ResumePreviewProps) {
  const template = getTemplate(settings.templateId);
  const labels = resumeLabels(settings.locale);
  const sections = resumeSections(data,settings);
  const contacts = contactItems(data);
  const photo = settings.showPhoto && data.personal.photo && /^data:image\/(?:png|jpe?g|webp);base64,/i.test(data.personal.photo) ? data.personal.photo : undefined;
  const style = {'--resume-accent':safeAccent(settings.accent,template.accent),'--resume-font-size':`${safeFontSize(settings.fontSize)}pt`} as CSSProperties;
  const auxiliary = sections.filter(section => section.auxiliary);
  const main = sections.filter(section => !section.auxiliary);
  const contactBlock = <address className="resume-contact">{contacts.map((item,index) => item.href ? <a key={index} href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a> : <span key={index}>{item.text}</span>)}</address>;
  return <article lang={settings.locale} style={style} className={`resume-page resume-${template.id} resume-font-${template.font} resume-header-${template.header} resume-cols-${template.columns} resume-sidebar-${template.sidebar ?? 'none'} resume-sections-${template.sectionStyle} resume-density-${template.density} resume-paper-${settings.paper.toLowerCase()} ${compact?'resume-compact':''}`}>
    <header className="resume-header">
      <div className="resume-identity"><h1>{data.personal.name || labels.name}</h1>{data.personal.headline && <p className="resume-headline">{data.personal.headline}</p>}{template.columns === 1 && contactBlock}</div>
      {photo && <img className="resume-photo" src={photo} alt={data.personal.name || labels.name} />}
    </header>
    <div className="resume-columns">
      {template.columns === 2 ? <>
        <div className="resume-main">{main.map(section => <Section section={section} key={section.id}/>)}</div>
        <aside className="resume-aside">{!!contacts.length && <section className="resume-section"><h2>{labels.contact}</h2>{contactBlock}</section>}{auxiliary.map(section => <Section section={section} key={section.id}/>)}</aside>
      </> : <div className="resume-main">{sections.map(section => <Section section={section} key={section.id}/>)}</div>}
    </div>
  </article>;
}
export default ResumePreview;
