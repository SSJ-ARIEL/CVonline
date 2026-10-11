import type { ResumeFontId } from './model';

export interface ResumeFontDefinition {
  id: ResumeFontId;
  label: string;
  category: 'sans' | 'serif';
  fontCSS: string;
  fontWordName: string;
  fontPdfFamily: string;
  fontPdfBoldFamily: string;
  regularPath: string;
  boldPath: string;
}

/** Locally hosted, openly licensed families. The automatic option follows the design. */
export const RESUME_FONTS: ResumeFontDefinition[] = [
  { id: 'inter', label: 'Inter', category: 'sans', fontCSS: "'Inter',Arial,sans-serif", fontWordName: 'Inter', fontPdfFamily: 'Inter', fontPdfBoldFamily: 'Inter Bold', regularPath: '/fonts/inter-regular.ttf', boldPath: '/fonts/inter-bold.ttf' },
  { id: 'lato', label: 'Lato', category: 'sans', fontCSS: "'Lato',Arial,sans-serif", fontWordName: 'Lato', fontPdfFamily: 'Lato', fontPdfBoldFamily: 'Lato Bold', regularPath: '/fonts/lato-regular.ttf', boldPath: '/fonts/lato-bold.ttf' },
  { id: 'montserrat', label: 'Montserrat', category: 'sans', fontCSS: "'Montserrat',Arial,sans-serif", fontWordName: 'Montserrat', fontPdfFamily: 'Montserrat', fontPdfBoldFamily: 'Montserrat Bold', regularPath: '/fonts/montserrat-regular.ttf', boldPath: '/fonts/montserrat-bold.ttf' },
  { id: 'source-sans', label: 'Source Sans 3', category: 'sans', fontCSS: "'Source Sans 3',Arial,sans-serif", fontWordName: 'Source Sans 3', fontPdfFamily: 'Source Sans 3', fontPdfBoldFamily: 'Source Sans 3 Bold', regularPath: '/fonts/source-sans-regular.ttf', boldPath: '/fonts/source-sans-bold.ttf' },
  { id: 'source-serif', label: 'Source Serif 4', category: 'serif', fontCSS: "'Source Serif 4',Georgia,serif", fontWordName: 'Source Serif 4', fontPdfFamily: 'Source Serif 4', fontPdfBoldFamily: 'Source Serif 4 Bold', regularPath: '/fonts/source-serif-regular.ttf', boldPath: '/fonts/source-serif-bold.ttf' },
  { id: 'merriweather', label: 'Merriweather', category: 'serif', fontCSS: "'Merriweather',Georgia,serif", fontWordName: 'Merriweather', fontPdfFamily: 'Merriweather', fontPdfBoldFamily: 'Merriweather Bold', regularPath: '/fonts/merriweather-regular.ttf', boldPath: '/fonts/merriweather-bold.ttf' },
];

export function getResumeFont(fontId: ResumeFontId = 'auto', templateFont: 'sans' | 'serif' = 'sans'): ResumeFontDefinition {
  const explicitFont = RESUME_FONTS.find(font => font.id === fontId);
  if (explicitFont) return explicitFont;
  const serif = templateFont === 'serif';
  return {
    id: 'auto', label: serif ? 'Georgia' : 'DM Sans', category: templateFont,
    fontCSS: serif ? "Georgia,'Times New Roman',serif" : "'DM Sans',Arial,sans-serif",
    fontWordName: serif ? 'Cambria' : 'Calibri',
    fontPdfFamily: serif ? 'Times-Roman' : 'Helvetica',
    fontPdfBoldFamily: serif ? 'Times-Bold' : 'Helvetica-Bold',
    regularPath: '', boldPath: '',
  };
}
