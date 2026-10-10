import type { Locale } from './model';
import { es } from './locales/es';
import { en } from './locales/en';
import { it } from './locales/it';
import { pt } from './locales/pt';

/** Plain text messages; interpolation never produces HTML. */
export const messages = { es, en, it, pt };

export function t(locale: Locale, key: string, values?: Record<string, string | number>): string {
  const dictionary: Record<string, string> = messages[locale] ?? es;
  const fallback: Record<string, string> = es;
  const message = Object.prototype.hasOwnProperty.call(dictionary, key)
    ? dictionary[key]
    : Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : key;
  if (!values) return message;
  return message.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (placeholder, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : placeholder,
  );
}
