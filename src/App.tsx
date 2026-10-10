import { useEffect } from 'react';
import { FileText, ArrowUpRight } from 'lucide-react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LOCALES, type Locale } from './model';
import { useResume, publicPath } from './state';
import { t } from './i18n';
import { getGuides } from './content';
import { Landing, HowItWorks, Guides, GuidePage, InformationPage, NotFound } from './PublicPages';
import { TemplatesPage } from './TemplatesPage';
import { LanguagePage, ProfilePage, WizardPage } from './Wizard';
import { ReviewPage } from './Review';
import { Advertising } from './Advertising';
import { StartLink } from './components/UI';

export function stripLocale(path:string) { return path.replace(/^\/(?:es|en|it|pt)(?=\/|$)/,'')||'/'; }
export function pageTitle(path:string,locale:Locale) {
  const route=stripLocale(path);const guide=route.startsWith('/guides/')?getGuides(locale).find(g=>g.slug===route.slice(8)):undefined;
  if(guide)return `${guide.title} — CVonline`;
  const key=route==='/templates'?'navTemplates':route==='/guides'?'navGuides':route==='/privacy'?'footerPrivacy':route==='/terms'?'footerTerms':route==='/about'?'footerAbout':route==='/how-it-works'?'navHow':route==='/review'?'reviewTitle':route==='/language'?'languageTitle':route==='/profile'?'profileTitle':'brandTag';
  return `CVonline — ${t(locale,key)}`;
}
function RouteEffects() {
  const {locale,setLocale,started,data}=useResume();const location=useLocation();
  useEffect(()=>{const code=location.pathname.split('/')[1];if(LOCALES.some(l=>l.code===code)&&code!==locale)setLocale(code as Locale);},[location.pathname,locale,setLocale]);
  useEffect(()=>{document.documentElement.lang=locale;document.title=pageTitle(location.pathname,locale);const description=document.querySelector('meta[name="description"]');const guide=getGuides(locale).find(g=>stripLocale(location.pathname)===`/guides/${g.slug}`);description?.setAttribute('content',guide?.description||t(locale,'heroDescription'));},[locale,location.pathname]);
  useEffect(()=>{window.scrollTo(0,0);document.querySelector<HTMLElement>('#main h1')?.focus({preventScroll:true});},[location.pathname]);
  useEffect(()=>{if(!started||!data.personal.name.trim())return;const handler=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler);},[started,data.personal.name]);
  return null;
}
function Header() {
  const {locale,setLocale}=useResume();const location=useLocation();const navigate=useNavigate();const editor=['/language','/profile','/review'].includes(location.pathname)||location.pathname.startsWith('/builder');
  const changeLocale=(value:Locale)=>{setLocale(value);if(!editor)navigate(publicPath(stripLocale(location.pathname),value));};
  return <header className="site-header"><Link className="wordmark" to={publicPath('/',locale)} aria-label="CVonline"><span className="brand-mark"><FileText size={20}/></span><span>CV<span className="wordmark-light">online</span><i/></span></Link><nav className="header-nav" aria-label={t(locale,'home')}><Link to={publicPath('/templates',locale)}>{t(locale,'navTemplates')}</Link><Link to={publicPath('/how-it-works',locale)}>{t(locale,'navHow')}</Link><Link to={publicPath('/guides',locale)}>{t(locale,'navGuides')}</Link></nav><div className="header-actions"><label className="visually-hidden" htmlFor="interface-language">{t(locale,'languageName')}</label><select id="interface-language" className="language-switch" value={locale} onChange={event=>changeLocale(event.target.value as Locale)}>{LOCALES.map(language=><option key={language.code} value={language.code}>{language.short}</option>)}</select>{!editor&&<StartLink className="button secondary header-action">{t(locale,'navStart')}<ArrowUpRight size={15}/></StartLink>}</div></header>;
}
function Footer() { const {locale}=useResume();return <footer className="site-footer"><span>© {new Date().getFullYear()} CVonline <span className="footer-note">— {t(locale,'footerNote')}</span></span><nav className="footer-links" aria-label={t(locale,'footerAbout')}><Link to={publicPath('/about',locale)}>{t(locale,'footerAbout')}</Link><Link to={publicPath('/privacy',locale)}>{t(locale,'footerPrivacy')}</Link><Link to={publicPath('/terms',locale)}>{t(locale,'footerTerms')}</Link></nav></footer>; }
export default function App() {
  const {locale}=useResume();const location=useLocation();const editor=['/language','/profile','/review'].includes(location.pathname)||location.pathname.startsWith('/builder');
  const publicRoutes=['',...LOCALES.map(language=>`/${language.code}`)].flatMap(prefix=>[
    <Route key={`${prefix}/`} path={prefix||'/'} element={<Landing/>}/>,
    <Route key={`${prefix}/templates`} path={`${prefix}/templates`} element={<TemplatesPage/>}/>,
    <Route key={`${prefix}/how-it-works`} path={`${prefix}/how-it-works`} element={<HowItWorks/>}/>,
    <Route key={`${prefix}/guides`} path={`${prefix}/guides`} element={<Guides/>}/>,
    <Route key={`${prefix}/guides/:slug`} path={`${prefix}/guides/:slug`} element={<GuidePage/>}/>,
    ...(['about','privacy','terms'] as const).map(kind=><Route key={`${prefix}/${kind}`} path={`${prefix}/${kind}`} element={<InformationPage kind={kind}/>}/>),
  ]);
  return <div className={`app-shell ${editor?'editor-shell':''}`}><a className="skip-link" href="#main">{t(locale,'skip')}</a><RouteEffects/><Header/><Routes>{publicRoutes}<Route path="/language" element={<LanguagePage/>}/><Route path="/profile" element={<ProfilePage/>}/><Route path="/builder/:step" element={<WizardPage/>}/><Route path="/review" element={<ReviewPage/>}/><Route path="/builder" element={<Navigate to="/builder/personal" replace/>}/><Route path="*" element={<NotFound/>}/></Routes>{!editor&&<Advertising/>}<Footer/></div>;
}
