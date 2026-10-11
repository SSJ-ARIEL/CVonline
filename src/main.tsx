import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-serif-display/400.css';
import '@fontsource/dm-serif-display/400-italic.css';
import './styles.css';
import './fonts.css';
import App, { isEditorRoute } from './App';
import { ResumeProvider } from './state';

// A legacy design-step URL can open the public catalog HTML directly. Start a
// clean editor document before mounting any form or collecting personal data.
if (isEditorRoute(location.pathname, location.search) && document.getElementById('adsense-verification')) {
  const template = new URLSearchParams(location.search).get('template');
  location.replace(`/language${template ? `?template=${encodeURIComponent(template)}` : ''}`);
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><ResumeProvider><App/></ResumeProvider></BrowserRouter></React.StrictMode>);
}
