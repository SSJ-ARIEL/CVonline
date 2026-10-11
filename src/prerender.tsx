import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App, { pageTitle, stripLocale } from './App';
import { ResumeProvider } from './state';
import { LOCALES } from './model';
import { getGuides } from './content';
import { t } from './i18n';
import { loadEnv } from 'vite';

const html=await readFile('dist/index.html','utf8');
// Use the same .env.production/.env.local and process overrides as the client build.
const configuration=loadEnv('production',process.cwd(),'VITE_');
const origin=(configuration.VITE_SITE_URL||'').replace(/\/$/,'');
const validOrigin=/^https:\/\/[a-z0-9.-]+$/i.test(origin)?origin:'';
const escape=(text:string)=>text.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
// Verification belongs in the HTML source, including the index.html SPA fallback.
// These public identifiers do not enable advertising or require an ad loader.
const verification=(configuration.VITE_GOOGLE_SITE_VERIFICATION||'').trim();
const client=(configuration.VITE_ADSENSE_CLIENT||'').trim();
const validClient=/^ca-pub-\d{16}$/.test(client);
const verificationMetadata=[
  verification?`<meta name="google-site-verification" content="${escape(verification)}" />`:'',
  validClient?`<meta name="google-adsense-account" content="${escape(client)}" />`:'',
].filter(Boolean).join('\n');
const shell=verificationMetadata?html.replace('</head>',()=>`${verificationMetadata}\n</head>`):html;
const paths:string[]=[];
for(const language of LOCALES){
  const prefix=language.code==='es'?'':`/${language.code}`;
  const pages=['/','/templates','/how-it-works','/guides','/about','/privacy','/terms',...getGuides(language.code).map(guide=>`/guides/${guide.slug}`)];
  for(const page of pages){
    const path=prefix+(page==='/'?(prefix?'':'/'):page);
    const markup=renderToString(<StaticRouter location={path}><ResumeProvider initialLanguage={language.code}><App/></ResumeProvider></StaticRouter>);
    const guide=getGuides(language.code).find(item=>stripLocale(path)===`/guides/${item.slug}`);
    const title=escape(pageTitle(path,language.code));const description=escape(guide?.description||t(language.code,'heroDescription'));
    let output=shell.replace('<html lang="es">',`<html lang="${language.code}">`).replace(/<title>.*?<\/title>/,`<title>${title}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${description}" />`).replace(/<meta property="og:title" content="[^"]*"\s*\/>/,`<meta property="og:title" content="${title}" />`).replace(/<meta property="og:description" content="[^"]*"\s*\/>/,`<meta property="og:description" content="${description}" />`).replace('<div id="root"></div>',`<div id="root">${markup}</div>`);
    if(validOrigin){
      const alternates=LOCALES.map(lang=>{const suffix=stripLocale(path);const alternative=lang.code==='es'?suffix:`/${lang.code}${suffix==='/'?'':suffix}`;return `<link rel="alternate" hreflang="${lang.code}" href="${validOrigin}${alternative}" />`;}).join('\n');
      output=output.replace('</head>',`<link rel="canonical" href="${validOrigin}${path}" />\n${alternates}\n</head>`);
    }
    const directory=path==='/'?'dist':`dist${path}`;await mkdir(directory,{recursive:true});await writeFile(`${directory}/index.html`,output);paths.push(path);
  }
}
if(validClient)await writeFile('dist/ads.txt',`google.com, ${client.replace('ca-','')}, DIRECT, f08c47fec0942fa0\n`);
else await rm('dist/ads.txt',{force:true});
if(validOrigin){
  await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${validOrigin}${path}</loc></url>`).join('')}</urlset>`);
  const robots=await readFile('dist/robots.txt','utf8');await writeFile('dist/robots.txt',`${robots}\nSitemap: ${validOrigin}/sitemap.xml\n`);
}
console.log(`Prerendered ${paths.length} public pages in four languages.`);
