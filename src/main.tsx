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
import App from './App';
import { ResumeProvider } from './state';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><ResumeProvider><App/></ResumeProvider></BrowserRouter></React.StrictMode>);
