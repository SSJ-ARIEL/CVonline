import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { unzipSync, strFromU8 } from 'fflate';
import { es } from '../src/locales/es';
import { en } from '../src/locales/en';
import { it } from '../src/locales/it';
import { pt } from '../src/locales/pt';

const dictionaries = { es, en, it, pt };
type Locale = keyof typeof dictionaries;
const languageNames = { es: 'Español', en: 'English', it: 'Italiano', pt: 'Português' };
const cvTypes = ['harvard', 'chronological', 'functional', 'combination', 'academic', 'european', 'technical', 'creative'] as const;
type CvType = typeof cvTypes[number];
const resumeFonts = [
  { id: 'inter', label: 'Inter', family: 'Inter', pdfFamily: /Inter/, wordName: 'Inter' },
  { id: 'lato', label: 'Lato', family: 'Lato', pdfFamily: /Lato/, wordName: 'Lato' },
  { id: 'montserrat', label: 'Montserrat', family: 'Montserrat', pdfFamily: /Montserrat/, wordName: 'Montserrat' },
  { id: 'source-sans', label: 'Source Sans 3', family: 'Source Sans 3', pdfFamily: /SourceSans3/, wordName: 'Source Sans 3' },
  { id: 'source-serif', label: 'Source Serif 4', family: 'Source Serif 4', pdfFamily: /SourceSerif4/, wordName: 'Source Serif 4' },
  { id: 'merriweather', label: 'Merriweather', family: 'Merriweather', pdfFamily: /Merriweather/, wordName: 'Merriweather' },
] as const;
const fullName = 'María Ñúñez Çavalli';
const description = 'Diseño accesible, comunicação clara y investigación de usuarios.';

function field(page: Page, label: string) {
  // Optional labels include a translated "optional" suffix.
  return page.getByLabel(label, { exact: false }).and(page.locator('input, textarea, select')).filter({ visible: true }).first();
}

async function chooseLanguage(page: Page, locale: Locale = 'es') {
  const copy = dictionaries[locale];
  await page.goto('/language');
  await page.locator('.language-card').filter({ hasText: languageNames[locale] }).click();
  await page.getByRole('button', { name: copy.languageAction, exact: true }).click();
  await expect(page).toHaveURL(/\/cv-type$/);
  await expect(page.locator('.cv-type-card')).toHaveCount(8);
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
}

async function chooseTypeAndDesign(page: Page, locale: Locale = 'es', cvType: CvType = 'chronological', oneColumn = false) {
  const copy = dictionaries[locale];
  await page.locator(`.cv-type-card[data-cv-type="${cvType}"]`).click();
  await page.getByRole('button', { name: copy.cvTypeAction, exact: true }).click();
  await expect(page).toHaveURL(/\/templates\?step=design$/);
  await expect(page.locator('.template-card')).toHaveCount(12);
  await expect(page.locator('.template-count')).toHaveText(copy.templateCount.replace('{count}', '50'));
  const card = oneColumn ? page.locator('.template-card').filter({ hasText: copy.oneColumn }).first() : page.locator('.template-card').first();
  const chosenName = await card.locator('.template-info h2').innerText();
  await card.locator('.template-preview-button').click();
  await expect(page).toHaveURL(/\/profile$/);
  return chosenName;
}

async function start(page: Page, locale: Locale = 'es', cvType: CvType = 'chronological') {
  const copy = dictionaries[locale];
  await chooseLanguage(page, locale);
  const chosenName = await chooseTypeAndDesign(page, locale, cvType);
  await page.getByRole('button', { name: new RegExp(copy.profileFirst) }).click();
  await page.getByRole('button', { name: copy.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/personal$/);
  return chosenName;
}

async function personal(page: Page, locale: Locale = 'es') {
  const copy = dictionaries[locale];
  await field(page, copy.name).fill(fullName);
  await field(page, copy.headline).fill('Diseñadora de producto');
  await field(page, copy.email).fill('maria.private@example.com');
  await field(page, copy.city).fill('São Paulo');
}

async function finish(page: Page, locale: Locale = 'es', summary = description) {
  const copy = dictionaries[locale];
  await page.getByRole('button', { name: copy.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/experience$/);
  await expect(page.getByRole('heading', { name: copy.experienceFirstTitle, exact: true })).toBeVisible();
  await page.getByRole('button', { name: copy.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/education$/);
  await page.getByRole('button', { name: copy.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/skills$/);
  await page.getByPlaceholder(copy.skillsPlaceholder).fill('Investigación, Acessibilidade, Design');
  await page.getByPlaceholder(copy.skillsPlaceholder).press('Enter');
  await expect(page.locator('.skill-tag')).toHaveCount(3);
  await page.getByRole('button', { name: copy.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/summary$/);
  await field(page, copy.summary).fill(summary);
  await page.getByRole('button', { name: copy.finish, exact: true }).click();
  await expect(page).toHaveURL(/\/review$/);
  await expect(page.locator('.preview-viewport .resume-page')).toContainText(fullName);
  await expect(page.locator('.preview-viewport .resume-page')).toContainText(summary);
}

async function photoFixture(page: Page, mimeType: 'image/png' | 'image/jpeg' | 'image/webp') {
  const uri = await page.evaluate((type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 50;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#26ddd8';
    context.fillRect(0, 0, 40, 50);
    context.fillStyle = '#222b34';
    context.fillRect(10, 10, 20, 20);
    return canvas.toDataURL(type);
  }, mimeType);
  return { name: `profile.${mimeType === 'image/jpeg' ? 'jpg' : mimeType.slice(6)}`, mimeType, buffer: Buffer.from(uri.split(',')[1], 'base64') };
}

async function getDownload(page: Page, label: string, fileName: string, testInfo: TestInfo) {
  const pending = page.waitForEvent('download', { timeout: 40_000 });
  await page.getByRole('button', { name: new RegExp(`^${label}`) }).click();
  const download = await pending;
  expect(await download.failure()).toBeNull();
  const output = testInfo.outputPath(fileName);
  await download.saveAs(output);
  return output;
}

async function loadDesignCollection(page: Page, expectedCount: number) {
  while (await page.locator('.template-card').count() < expectedCount) {
    const previousCount = await page.locator('.template-card').count();
    await page.locator('#design-load-more').click();
    await expect(page.locator('.template-card')).toHaveCount(Math.min(previousCount + 12, expectedCount));
  }
  await expect(page.locator('.template-card')).toHaveCount(expectedCount);
  await expect(page.locator('#design-load-more')).toHaveCount(0);
}

for (const locale of ['es', 'en', 'it', 'pt'] as const) {
  test(`complete questionnaire and editable Word in ${locale}`, async ({ page }, testInfo) => {
    const copy = dictionaries[locale];
    const chosenName = await start(page, locale);
    await personal(page, locale);
    await finish(page, locale);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('.preview-viewport article')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('heading', { name: copy.reviewTitle, exact: true })).toBeVisible();
    await expect(page.locator('#review-template option:checked')).toHaveText(chosenName);
    await expect(page.locator('#review-template option')).toHaveCount(50);
    if (locale === 'es') await page.screenshot({ path: '/tmp/cvonline-review.png', fullPage: true });
    const downloaded = await getDownload(page, copy.downloadWord, `cv-${locale}.docx`, testInfo);
    const docx = unzipSync(await readFile(downloaded));
    const xml = strFromU8(docx['word/document.xml']);
    expect(xml).toContain(fullName);
    expect(xml).toContain(description);
    // Designs may uppercase headings; the translated wording must remain.
    expect(xml.toLocaleLowerCase(locale)).toContain(copy.summary.toLocaleLowerCase(locale));
    expect(xml).toContain('<w:t');
  });
}

test('required name, malformed contacts and chronological dates stop navigation', async ({ page }) => {
  await start(page);
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(es.errorName);
  await expect(field(page, es.name)).toBeFocused();
  await personal(page);
  await field(page, es.email).fill('invalid@email');
  await field(page, es.website).fill('javascript:alert(1)');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText([es.errorEmail, es.errorUrl]);
  await expect(page).toHaveURL(/\/builder\/personal$/);
  await field(page, es.email).fill('maria@example.com');
  await field(page, es.website).fill('https://example.com');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByRole('button', { name: es.addExperience, exact: true }).click();
  await field(page, es.role).fill('Diseñadora');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(es.errorEntry);
  await field(page, es.company).fill('Estudio Ç');
  await field(page, es.startDate).fill('2024-10');
  await field(page, es.endDate).fill('2023-05');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(es.errorDates);
  await expect(page).toHaveURL(/\/builder\/experience$/);
  await page.getByRole('checkbox', { name: es.currentJob, exact: true }).check();
  await expect(field(page, es.endDate)).toBeDisabled();
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/education$/);
  await page.getByRole('button', { name: es.addEducation, exact: true }).click();
  await field(page, es.degree).fill('Diseño');
  await field(page, es.institution).fill('Universidad');
  await field(page, es.startDate).fill('2022-09');
  await field(page, es.endDate).fill('2021-06');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(es.errorDates);
  await field(page, es.endDate).fill('2025-06');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/skills$/);
});

test('PNG, JPEG and WebP photos are processed locally; invalid files are rejected', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', request => {
    if (request.method() !== 'GET' || !request.url().startsWith('http://127.0.0.1:5173')) sent.push(request.url());
  });
  await start(page);
  for (const mime of ['image/png', 'image/jpeg', 'image/webp'] as const) {
    await page.locator('#photo-input').setInputFiles(await photoFixture(page, mime));
    const photo = page.locator('.photo-uploader img');
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    expect(await photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(40);
    await page.getByRole('button', { name: es.photoRemove, exact: true }).click();
    await expect(photo).toHaveCount(0);
  }
  await page.locator('#photo-input').setInputFiles({ name: 'document.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.7 invalid photo') });
  await expect(page.getByRole('alert')).toHaveText(es.photoError);
  await page.locator('#photo-input').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('invalid image bytes') });
  await expect(page.getByRole('alert')).toHaveText(es.photoError);
  await expect(page.locator('.photo-uploader img')).toHaveCount(0);
  expect(sent).toEqual([]);
});

test('PDF and Word retain Unicode, photo, long text and configurable page size', async ({ page }, testInfo) => {
  test.setTimeout(100_000);
  await start(page);
  await personal(page);
  await page.locator('#photo-input').setInputFiles(await photoFixture(page, 'image/png'));
  await expect(page.locator('.photo-uploader img')).toBeVisible();
  const longSummary = `${description}\n${Array.from({ length: 65 }, (_, index) => `Proyecto ${index + 1}: investigación, diseño y comunicación con el equipo.`).join('\n')}\nÚltimo resultado: São Paulo, año 2026.`;
  await finish(page, 'es', longSummary);
  await page.locator('#paper-size').selectOption('LETTER');
  await expect(page.locator('.preview-viewport article')).toHaveClass(/resume-paper-letter/);
  await page.screenshot({ path: '/tmp/cvonline-long-review.png', fullPage: true });
  const pdfPath = await getDownload(page, es.downloadPdf, 'resume-unicode.pdf', testInfo);
  const pdfBytes = await readFile(pdfPath);
  expect(pdfBytes.subarray(0, 5).toString()).toBe('%PDF-');
  const text = execFileSync('pdftotext', [pdfPath, '-'], { encoding: 'utf8' });
  expect(text).toContain(fullName);
  expect(text).toContain('comunicação');
  expect(text).toContain('Último resultado: São Paulo, año 2026.');
  const info = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
  expect(info).toMatch(/Page size:\s+612 x 792 pts/);
  expect(Number(/Pages:\s+(\d+)/.exec(info)?.[1])).toBeGreaterThan(1);
  const images = execFileSync('pdfimages', ['-list', pdfPath], { encoding: 'utf8' });
  expect(images).toMatch(/\bimage\b/);
  // Two-column PDFs must retain both long main content and the side column.
  await page.locator('#review-template').selectOption('prism');
  const twoColumnPdf = await getDownload(page, es.downloadPdf, 'resume-two-columns.pdf', testInfo);
  const twoColumnText = execFileSync('pdftotext', [twoColumnPdf, '-'], { encoding: 'utf8' });
  expect(twoColumnText).toContain(fullName);
  expect(twoColumnText).toContain('Último resultado: São Paulo, año 2026.');
  expect(twoColumnText).toContain('Acessibilidade');
  expect(twoColumnText).toContain('maria.private@example.com');
  const docxPath = await getDownload(page, es.downloadWord, 'resume-unicode.docx', testInfo);
  const files = unzipSync(await readFile(docxPath));
  const xml = strFromU8(files['word/document.xml']);
  expect(xml).toContain(fullName);
  expect(xml).toContain('Último resultado: São Paulo, año 2026.');
  expect(xml).toContain('<w:t');
  expect(xml).toContain('<w:drawing>');
  expect(xml).toContain('w:w="12240"');
  expect(Object.keys(files).filter(name => /^word\/media\/.*\.(?:jpg|png)$/.test(name))).toHaveLength(1);
  await page.getByRole('checkbox', { name: es.photoShow, exact: true }).uncheck();
  await expect(page.locator('.preview-viewport .resume-photo')).toHaveCount(0);
  const noPhoto = unzipSync(await readFile(await getDownload(page, es.downloadWord, 'resume-no-photo.docx', testInfo)));
  expect(strFromU8(noPhoto['word/document.xml'])).not.toContain('<w:drawing>');
});

test('answers stay in memory across steps, never leave the browser and disappear on reload/reset', async ({ page }) => {
  const requests: { url: string; body: string | null; method: string }[] = [];
  const errors: string[] = [];
  page.on('request', request => requests.push({ url: request.url(), body: request.postData(), method: request.method() }));
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  await start(page);
  await personal(page);
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByRole('link', { name: es.back, exact: true }).click();
  await expect(field(page, es.name)).toHaveValue(fullName);
  await expect(field(page, es.email)).toHaveValue('maria.private@example.com');
  await finish(page);
  const browserStorage = await page.evaluate(async () => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie, databases: (await indexedDB.databases()).map(database => database.name) }));
  expect(browserStorage).toEqual({ local: 0, session: 0, cookies: '', databases: [] });
  await expect(page.locator('script[src*="adsbygoogle"], script[src*="googlesyndication"]')).toHaveCount(0);
  expect(requests.filter(request => !request.url.startsWith('http://127.0.0.1:5173'))).toEqual([]);
  expect(requests.filter(request => request.method !== 'GET')).toEqual([]);
  for (const request of requests) {
    expect(`${request.url} ${request.body ?? ''}`).not.toContain('maria.private');
    expect(`${request.url} ${request.body ?? ''}`).not.toContain(fullName);
  }
  expect(errors).toEqual([]);
  await page.reload();
  await expect(page).toHaveURL(/\/language$/);
  await start(page);
  await personal(page);
  await finish(page);
  await page.getByRole('button', { name: es.startOver, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: es.cancel, exact: true }).click();
  await expect(page.locator('.preview-viewport')).toContainText(fullName);
  await page.getByRole('button', { name: es.startOver, exact: true }).click();
  await page.getByRole('button', { name: es.resetConfirm, exact: true }).click();
  await expect(page).toHaveURL(/\/language$/);
  await page.getByRole('button', { name: es.languageAction, exact: true }).click();
  await chooseTypeAndDesign(page);
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(field(page, es.name)).toHaveValue('');
});

test('all 400 unique designs, type filters and public information are reachable', async ({ page }) => {
  test.setTimeout(100_000);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tu experiencia');
  await page.screenshot({ path: '/tmp/cvonline-final-desktop.png', fullPage: true });
  await page.getByRole('link', { name: es.navTemplates, exact: true }).click();
  await expect(page.locator('.template-card')).toHaveCount(12);
  await expect(page.locator('.template-count')).toHaveText('400 diseños');
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const cvType of cvTypes) {
    await page.locator(`[data-cv-filter="${cvType}"]`).click();
    await expect(page.locator('.template-card')).toHaveCount(12);
    await expect(page.locator('.template-count')).toHaveText('50 diseños');
    await loadDesignCollection(page, 50);
    const designs = await page.locator('.template-card').evaluateAll(cards => cards.map(card => ({
      id: card.getAttribute('data-template-id')!,
      name: card.querySelector('.template-info h2')!.textContent!,
      type: card.getAttribute('data-template-cv-type'),
    })));
    for (const design of designs) {
      expect(design.type).toBe(cvType);
      expect(ids.has(design.id), `Repeated design ID ${design.id}`).toBe(false);
      expect(names.has(design.name), `Repeated design name ${design.name}`).toBe(false);
      ids.add(design.id);
      names.add(design.name);
    }
  }
  expect(ids.size).toBe(400);
  expect(names.size).toBe(400);
  // Saved links to the original designs remain usable.
  for (const id of ['folio', 'prism', 'muse', 'signal']) expect(ids.has(id)).toBe(true);
  await page.locator('[data-cv-filter="all"]').click();
  await expect(page.locator('.resume-page')).toHaveCount(12);
  await expect(page.locator('.template-count')).toHaveText('400 diseños');
  await expect(page.locator('.catalog-note')).toHaveText(es.templatesSample);
  await page.getByRole('link', { name: es.navHow, exact: true }).click();
  await expect(page.locator('.how-card')).toHaveCount(3);
  await page.getByRole('link', { name: es.navGuides, exact: true }).click();
  await expect(page.locator('.article-card').nth(5)).toBeVisible();
  expect(await page.locator('.article-card').count()).toBeGreaterThanOrEqual(6);
  await page.locator('.article-card').first().click();
  expect((await page.locator('.article-body').innerText()).length).toBeGreaterThan(1000);
  for (const label of [es.footerPrivacy, es.footerTerms, es.footerAbout]) {
    await page.getByRole('link', { name: label, exact: true }).click();
    await expect(page.locator('.article-body')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  await page.locator('#interface-language').selectOption('pt');
  await expect(page).toHaveURL(/\/pt\/about$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
});

test('mobile 390px supports type selection, the full flow and every template without horizontal overflow', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await page.setViewportSize({ width: 390, height: 844 });
  const noOverflow = async () => {
    const widths = await page.evaluate(() => ({ viewport: innerWidth, body: document.documentElement.scrollWidth }));
    expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);
  };
  await page.goto('/');
  await noOverflow();
  await page.screenshot({ path: '/tmp/cvonline-final-mobile.png', fullPage: true });
  await chooseLanguage(page);
  await noOverflow();
  await page.screenshot({ path: '/tmp/cvonline-cv-type-mobile.png', fullPage: true });
  await chooseTypeAndDesign(page);
  await noOverflow();
  await page.getByRole('button', { name: new RegExp(es.profileFirst) }).click();
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await noOverflow();
  await personal(page);
  await finish(page);
  await noOverflow();
  const options = await page.locator('#review-template option').evaluateAll(nodes => nodes.map(node => (node as HTMLOptionElement).value));
  expect(options).toHaveLength(50);
  for (const value of options) {
    await page.locator('#review-template').selectOption(value);
    await expect(page.locator('.preview-viewport article')).toContainText(fullName);
    await noOverflow();
  }
  await page.screenshot({ path: '/tmp/cvonline-review-mobile.png', fullPage: true });
  // A full document navigation clears the in-memory editing session.
  await page.goto('/templates');
  await expect(page.locator('.template-card')).toHaveCount(12);
  await expect(page.locator('.template-count')).toHaveText('400 diseños');
  await noOverflow();
});

test('translation rejects identical languages without changing answers', async ({ page }) => {
  await start(page);
  await personal(page);
  await finish(page);
  await page.locator('.translation-panel summary').click();
  await page.getByRole('button', { name: es.translateAction, exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(es.translateSame);
  await expect(page.locator('.preview-viewport article')).toContainText(description);
  await expect(page.locator('.preview-viewport article')).toContainText('maria.private@example.com');
});

async function reachSkills(page: Page) {
  await start(page);
  await personal(page);
  for (const step of ['experience', 'education', 'skills']) {
    await page.getByRole('button', { name: es.next, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/builder/${step}$`));
  }
}

test('continuing keeps skills and interests typed without pressing Enter', async ({ page }) => {
  await reachSkills(page);
  const skills = page.getByPlaceholder(es.skillsPlaceholder);
  await skills.fill('TypeScript, Comunicación');
  await skills.press('Enter');
  await skills.fill('Diseño UX, TypeScript, , Comunicación');
  await page.getByPlaceholder(es.interestsPlaceholder).fill('Fotografía, Música, Fotografía');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/summary$/);
  await page.getByRole('button', { name: es.summaryGenerate, exact: true }).click();
  await expect(field(page, es.summary)).toHaveValue(/TypeScript, Comunicación, Diseño UX/);
  await page.getByRole('link', { name: es.back, exact: true }).click();
  await expect(page.locator('.skill-tag')).toHaveCount(5);
  await expect(skills).toHaveValue('');
  await expect(page.getByPlaceholder(es.interestsPlaceholder)).toHaveValue('');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByRole('button', { name: es.finish, exact: true }).click();
  await expect(page).toHaveURL(/\/review$/);
  await expect(page.locator('.preview-viewport .resume-section-skills .resume-tags span')).toHaveText(['TypeScript', 'Comunicación', 'Diseño UX']);
  await expect(page.locator('.preview-viewport .resume-section-interests .resume-tags span')).toHaveText(['Fotografía', 'Música']);
});

test('partial custom sections show missing fields and preserve content until completed', async ({ page }) => {
  await reachSkills(page);
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByRole('button', { name: es.addCustom, exact: true }).click();
  await page.getByLabel(es.customTitle, { exact: true }).first().fill('Premios');
  await page.getByRole('button', { name: es.addCustom, exact: true }).click();
  await page.getByLabel(es.customBody, { exact: true }).nth(1).fill('Ponencia sobre diseño accesible');
  await page.getByRole('button', { name: es.addCustom, exact: true }).click();
  await page.getByRole('button', { name: es.finish, exact: true }).click();
  await expect(page).toHaveURL(/\/builder\/summary$/);
  await expect(page.getByRole('alert')).toHaveText([es.required, es.required]);
  await expect(page.getByLabel(es.customBody, { exact: true }).first()).toBeFocused();
  await expect(page.getByLabel(es.customTitle, { exact: true }).first()).toHaveValue('Premios');
  await expect(page.getByLabel(es.customBody, { exact: true }).nth(1)).toHaveValue('Ponencia sobre diseño accesible');
  await page.getByLabel(es.customBody, { exact: true }).first().fill('Premio de diseño 2026');
  await page.getByLabel(es.customTitle, { exact: true }).nth(1).fill('Publicaciones');
  await page.getByRole('button', { name: es.finish, exact: true }).click();
  await expect(page).toHaveURL(/\/review$/);
  const resume = page.locator('.preview-viewport article');
  await expect(resume).toContainText('Premios');
  await expect(resume).toContainText('Premio de diseño 2026');
  await expect(resume).toContainText('Publicaciones');
  await expect(resume).toContainText('Ponencia sobre diseño accesible');
  await page.getByRole('link', { name: es.editAnswers, exact: true }).click();
  await page.locator('.flow-progress').getByRole('link', { name: /Tu presentación/ }).click();
  await expect(page.locator('.entry-card')).toHaveCount(2);
});

test('each CV type explains its purpose and offers fifty exclusive professional designs', async ({ page }) => {
  test.setTimeout(100_000);
  const names = new Set<string>();
  for (const cvType of cvTypes) {
    await chooseLanguage(page);
    const card = page.locator(`.cv-type-card[data-cv-type="${cvType}"]`);
    expect((await card.innerText()).trim().length).toBeGreaterThan(100);
    await card.click();
    await page.getByRole('button', { name: es.cvTypeAction, exact: true }).click();
    await expect(page).toHaveURL(/\/templates\?step=design$/);
    await expect(page.locator('.template-card')).toHaveCount(12);
    await expect(page.locator('.template-count')).toHaveText('50 diseños');
    await loadDesignCollection(page, 50);
    for (const name of await page.locator('.template-info h2').allTextContents()) {
      expect(names.has(name)).toBe(false);
      names.add(name);
    }
    await expect(page.locator('.catalog-note')).toHaveText(es.templatesSample);
  }
  expect(names.size).toBe(400);
  await page.locator('.template-card').last().locator('.template-preview-button').click();
  await expect(page).toHaveURL(/\/profile$/);
});

test('catalog search finds accented type labels and resets paging when filters or queries change', async ({ page }) => {
  await page.goto('/templates');
  await expect(page.locator('.template-card')).toHaveCount(12);
  await expect(page.locator('.template-count')).toHaveAttribute('data-total-designs', '400');
  await page.locator('#design-load-more').click();
  await expect(page.locator('.template-card')).toHaveCount(24);
  await page.locator('#design-search').fill('CRONOLOGICO');
  await expect(page.locator('.template-count')).toHaveText('50 diseños');
  await expect(page.locator('.template-card')).toHaveCount(12);
  const foundTypes = await page.locator('.template-card').evaluateAll(cards => cards.map(card => card.getAttribute('data-template-cv-type')));
  expect(new Set(foundTypes)).toEqual(new Set(['chronological']));
  await page.locator('#design-load-more').click();
  await expect(page.locator('.template-card')).toHaveCount(24);
  await page.locator('#design-search').fill('not-an-existing-cv-design');
  await expect(page.locator('.template-card')).toHaveCount(0);
  await expect(page.locator('.template-count')).toHaveText('0 diseños');
  await expect(page.locator('.catalog-empty')).toBeVisible();
  await page.getByRole('button', { name: es.designClearSearch, exact: true }).click();
  await expect(page.locator('#design-search')).toHaveValue('');
  await expect(page.locator('.template-card')).toHaveCount(12);
  await expect(page.locator('.template-count')).toHaveText('400 diseños');
  await page.locator('#design-load-more').click();
  await expect(page.locator('.template-card')).toHaveCount(24);
  await page.locator('[data-cv-filter="harvard"]').click();
  await expect(page.locator('.template-card')).toHaveCount(12);
  await expect(page.locator('.template-count')).toHaveText('50 diseños');
  await page.locator('#design-search').fill('cambridge');
  await expect(page.locator('.template-card')).toHaveCount(10);
  for (const name of await page.locator('.template-info h2').allTextContents()) expect(name.toLowerCase()).toContain('cambridge');
});

test('six selectable fonts reach every preview heading, embed in PDF and remain editable in Word', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await start(page);
  await personal(page);
  await page.locator('#photo-input').setInputFiles(await photoFixture(page, 'image/png'));
  await expect(page.locator('.photo-uploader img')).toBeVisible();
  await finish(page);
  const fontSelector = page.locator('#review-font-family');
  await expect(fontSelector).toHaveValue('auto');
  await expect(fontSelector.locator('option')).toHaveCount(7);
  expect(await fontSelector.locator('option').evaluateAll(nodes => nodes.map(node => (node as HTMLOptionElement).value))).toEqual(['auto', ...resumeFonts.map(font => font.id)]);
  await expect(page.locator('#font-family-notice')).toHaveText(es.fontNoticeWord);
  for (const font of resumeFonts) {
    await fontSelector.selectOption(font.id);
    await page.evaluate(() => document.fonts.ready);
    const previewFamilies = await page.locator('.preview-viewport article').evaluate(article => [
      article,
      article.querySelector('h1')!,
      article.querySelector('h2')!,
      article.querySelector('.resume-body-text')!,
    ].map(element => getComputedStyle(element).fontFamily));
    for (const family of previewFamilies) expect(family).toContain(font.family);
    const pdf = await getDownload(page, es.downloadPdf, `font-${font.id}.pdf`, testInfo);
    const pdfText = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8' });
    expect(pdfText).toContain(fullName);
    expect(pdfText).toContain('comunicação');
    expect(pdfText).toContain('maria.private@example.com');
    const pdfFonts = execFileSync('pdffonts', [pdf], { encoding: 'utf8' });
    const rows = pdfFonts.trim().split('\n').slice(2);
    expect(rows.length).toBeGreaterThanOrEqual(2);
    for (const row of rows) {
      expect(row).toMatch(font.pdfFamily);
      // Embedded/subset/Unicode columns: the font is embedded and searchable.
      expect(row).toMatch(/\byes\s+(?:yes|no)\s+yes\s+\d+\s+\d+$/);
    }
    expect(execFileSync('pdfimages', ['-list', pdf], { encoding: 'utf8' })).toMatch(/\bimage\b/);
    const files = unzipSync(await readFile(await getDownload(page, es.downloadWord, `font-${font.id}.docx`, testInfo)));
    const documentXml = strFromU8(files['word/document.xml']);
    const stylesXml = strFromU8(files['word/styles.xml']);
    expect(documentXml).toContain(fullName);
    expect(documentXml).toContain(description);
    expect(documentXml).toContain('<w:drawing>');
    expect(`${stylesXml}${documentXml}`).toContain(`w:ascii="${font.wordName}"`);
    expect(`${stylesXml}${documentXml}`).toContain(`w:hAnsi="${font.wordName}"`);
  }
  await fontSelector.selectOption('inter');
  await page.locator('#review-template').selectOption('prism--contact-strip');
  await expect(fontSelector).toHaveValue('inter');
  await expect(page.locator('.preview-viewport article')).toContainText(fullName);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(fontSelector).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  expect(errors).toEqual([]);
});

test('multipage Lato rail PDF retains every long job and project title at page boundaries', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const paragraph = 'Diseño accesible, comunicação clara y investigación de usuarios. Coordinación de equipos y proyectos profesionales en ámbitos internacionales.';
  const jobs = Array.from({ length: 7 }, (_, index) => ({
    role: `Responsable ${index + 1} de investigación y comunicación estratégica Ñ Ç`,
    company: `Organización ${index + 1} São Paulo`,
    achievement: `Logro ${index + 1} de investigación internacional\nResultados medibles ${index + 1} con equipos y accesibilidad`,
  }));
  const projects = Array.from({ length: 4 }, (_, index) => `Proyecto ${index + 1} de investigación estratégica Ñ Ç`);
  await start(page);
  await personal(page);
  await field(page, es.email).fill('alex@example.com');
  await field(page, es.phone).fill('+34 600 123 456');
  await field(page, es.website).fill('https://alexmorgan.example');
  await page.locator('#photo-input').setInputFiles(await photoFixture(page, 'image/png'));
  await expect(page.locator('.photo-uploader img')).toBeVisible();
  await page.getByRole('button', { name: es.next, exact: true }).click();
  for (const [index, job] of jobs.entries()) {
    await page.getByRole('button', { name: es.addExperience, exact: true }).click();
    const entry = page.locator('.entry-card').nth(index);
    await entry.getByLabel(es.role, { exact: true }).fill(job.role);
    await entry.getByLabel(es.company, { exact: true }).fill(job.company);
    await entry.getByLabel(es.location, { exact: false }).fill('São Paulo');
    await entry.getByLabel(es.startDate, { exact: true }).fill(`${2015 + index}-03`);
    await entry.getByLabel(es.endDate, { exact: true }).fill(`${2016 + index}-04`);
    await entry.getByLabel(es.responsibilities, { exact: true }).fill(paragraph.repeat(8));
    await entry.getByLabel(es.achievements, { exact: true }).fill(job.achievement);
  }
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByRole('button', { name: es.addEducation, exact: true }).click();
  await field(page, es.degree).fill('Grado en Diseño');
  await field(page, es.institution).fill('Universidad de Diseño');
  await field(page, es.location).fill('Madrid');
  await field(page, es.startDate).fill('2017-09');
  await field(page, es.endDate).fill('2021-06');
  for (const project of projects) {
    await page.getByRole('button', { name: es.addProject, exact: true }).click();
    const entry = page.locator('.entry-card').last();
    await entry.getByLabel(es.projectName, { exact: true }).fill(project);
    await entry.getByLabel(es.projectDescription, { exact: true }).fill(paragraph.repeat(6));
  }
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByPlaceholder(es.skillsPlaceholder).fill('Diseño de producto, Investigación, Figma, Prototipado');
  await page.getByRole('button', { name: es.addLanguage, exact: true }).click();
  await page.getByRole('textbox', { name: es.languageName, exact: true }).fill('Inglés');
  await page.getByRole('combobox', { name: es.languageLevel, exact: true }).selectOption('C1');
  await page.getByRole('button', { name: es.addCertification, exact: true }).click();
  await field(page, es.certificationName).fill('Certificación avanzada Ñ');
  await field(page, es.issuer).fill('Associação de Pesquisa');
  await field(page, es.certificationDate).fill('2024-01');
  await page.getByPlaceholder(es.interestsPlaceholder).fill('Investigación, Ciência, Design');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await field(page, es.summary).fill(paragraph.repeat(12));
  await page.getByRole('button', { name: es.addCustom, exact: true }).click();
  await field(page, es.customTitle).fill('Publicaciones / Pubblicazioni');
  await field(page, es.customBody).fill(paragraph.repeat(10));
  await page.getByRole('button', { name: es.finish, exact: true }).click();
  await expect(page).toHaveURL(/\/review$/);
  await page.locator('#review-template').selectOption('prism--contact-strip');
  await page.locator('#review-font-family').selectOption('lato');
  await page.locator('#paper-size').selectOption('LETTER');
  await page.locator('#font-size').focus();
  await page.locator('#font-size').press('End');
  await expect(page.locator('#font-size')).toHaveValue('13');
  const pdf = await getDownload(page, es.downloadPdf, 'lato-rail-page-boundaries.pdf', testInfo);
  const text = execFileSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8' });
  const searchable = text.normalize('NFC').replace(/\s+/gu, '');
  for (const title of [...jobs.flatMap(job => [job.role, job.company]), ...projects]) {
    expect(searchable, `Missing full title at a PDF page boundary: ${title}`).toContain(title.replace(/\s+/gu, ''));
  }
  expect(searchable).toContain(fullName.replace(/\s+/gu, ''));
  // Designs may uppercase and track section headings in the exported PDF.
  expect(searchable.toLocaleUpperCase('es')).toContain('PUBLICACIONES/PUBBLICAZIONI');
  // Flow extraction keeps wrapped sidebar text together instead of interleaving columns.
  const flowingText = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8' }).replace(/\s+/gu, '');
  expect(flowingText).toContain('CertificaciónavanzadaÑ');
  expect(Number(/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8' }))?.[1])).toBeGreaterThan(1);
  expect(execFileSync('pdffonts', [pdf], { encoding: 'utf8' })).toMatch(/Lato-Regular/);
});

test('type selection is translated and remains usable at 390px in all four languages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ['es', 'en', 'it', 'pt'] as const) {
    const copy = dictionaries[locale];
    await chooseLanguage(page, locale);
    await expect(page.getByRole('heading', { name: copy.cvTypeTitle, exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: copy.cvTypeAction, exact: true })).toBeVisible();
    const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
    for (const cvType of cvTypes) {
      const card = page.locator(`.cv-type-card[data-cv-type="${cvType}"]`);
      await expect(card).toBeVisible();
      expect((await card.innerText()).trim().length).toBeGreaterThan(80);
    }
  }
});

test('direct editor routes require language, then a CV type and a design', async ({ page }) => {
  for (const path of ['/cv-type', '/templates?step=design', '/profile', '/builder/personal', '/review']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/language$/);
  }
  await chooseLanguage(page);
  await page.evaluate(() => {
    history.pushState({}, '', '/profile');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page).toHaveURL(/\/cv-type$/);
  await page.locator('.cv-type-card[data-cv-type="technical"]').click();
  await page.getByRole('button', { name: es.cvTypeAction, exact: true }).click();
  await page.evaluate(() => {
    history.pushState({}, '', '/builder/personal');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page).toHaveURL(/\/templates\?step=design$/);
  await page.locator('.template-preview-button').first().click();
  await expect(page).toHaveURL(/\/profile$/);
});

function expectMarkersInOrder(text: string, markers: string[]) {
  // PDF text extraction may add spaces between tracked heading letters.
  const searchable = text.replace(/\s+/g, '');
  let previous = -1;
  for (const marker of markers) {
    const index = searchable.indexOf(marker);
    expect(index, `Missing marker ${marker}`).toBeGreaterThanOrEqual(0);
    expect(index, `${marker} should follow ${markers[markers.indexOf(marker) - 1] ?? 'the name'}`).toBeGreaterThan(previous);
    previous = index;
  }
}

test('changing all eight types keeps answers and changes section order in previews, PDF and Word', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  await start(page);
  await personal(page);
  await page.locator('#photo-input').setInputFiles(await photoFixture(page, 'image/png'));
  await expect(page.locator('.photo-uploader img')).toBeVisible();
  const photoSrc = await page.locator('.photo-uploader img').getAttribute('src');
  expect(photoSrc).toMatch(/^data:image\/jpeg;base64,/);
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByRole('button', { name: es.addExperience, exact: true }).click();
  let entry = page.locator('.entry-card').first();
  await entry.getByLabel(es.role, { exact: true }).fill('ANTIGUAVERIFICADA');
  await entry.getByLabel(es.company, { exact: true }).fill('Estudio anterior');
  await entry.getByLabel(es.startDate, { exact: true }).fill('2011-01');
  await entry.getByLabel(es.endDate, { exact: true }).fill('2014-06');
  await page.getByRole('button', { name: es.addExperience, exact: true }).click();
  entry = page.locator('.entry-card').nth(1);
  await entry.getByLabel(es.role, { exact: true }).fill('EXPERIENCIAVERIFICADA');
  await entry.getByLabel(es.company, { exact: true }).fill('Estudio actual');
  await entry.getByLabel(es.startDate, { exact: true }).fill('2021-03');
  await entry.getByRole('checkbox', { name: es.currentJob, exact: true }).check();
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByRole('button', { name: es.addEducation, exact: true }).click();
  await field(page, es.degree).fill('FORMACIONVERIFICADA');
  await field(page, es.institution).fill('Universidad de ejemplo');
  await page.getByRole('button', { name: es.addProject, exact: true }).click();
  await field(page, es.projectName).fill('PROYECTOVERIFICADO');
  await field(page, es.projectDescription).fill('Proyecto accesible construido con investigación.');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await page.getByPlaceholder(es.skillsPlaceholder).fill('COMPETENCIAVERIFICADA');
  await page.getByRole('button', { name: es.addLanguage, exact: true }).click();
  await page.getByRole('textbox', { name: es.languageName, exact: true }).fill('IDIOMAVERIFICADO');
  await page.getByRole('combobox', { name: es.languageLevel, exact: true }).selectOption('C1');
  await page.getByRole('button', { name: es.addCertification, exact: true }).click();
  await field(page, es.certificationName).fill('CERTIFICACIONVERIFICADA');
  await page.getByPlaceholder(es.interestsPlaceholder).fill('INTERESVERIFICADO');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  await field(page, es.summary).fill('PERFILVERIFICADO');
  await page.getByRole('button', { name: es.addCustom, exact: true }).click();
  await field(page, es.customTitle).fill('PUBLICACIONVERIFICADA');
  await field(page, es.customBody).fill('Artículo publicado sobre accesibilidad.');
  await page.getByRole('button', { name: es.finish, exact: true }).click();
  await expect(page).toHaveURL(/\/review$/);
  await page.locator('#review-font-family').selectOption('inter');
  const markers = {
    summary: 'PERFILVERIFICADO', experience: 'EXPERIENCIAVERIFICADA', education: 'FORMACIONVERIFICADA',
    projects: 'PROYECTOVERIFICADO', skills: 'COMPETENCIAVERIFICADA', custom: 'PUBLICACIONVERIFICADA',
    languages: 'IDIOMAVERIFICADO', certifications: 'CERTIFICACIONVERIFICADA', interests: 'INTERESVERIFICADO',
  };
  const expectedOrder: Record<CvType, (keyof typeof markers)[]> = {
    harvard: ['summary', 'education', 'experience', 'projects', 'custom', 'skills', 'languages', 'certifications', 'interests'],
    chronological: ['summary', 'experience', 'education', 'projects', 'custom', 'skills', 'languages', 'certifications', 'interests'],
    functional: ['summary', 'skills', 'projects', 'experience', 'education', 'custom', 'certifications', 'languages', 'interests'],
    combination: ['summary', 'skills', 'experience', 'projects', 'education', 'custom', 'certifications', 'languages', 'interests'],
    academic: ['summary', 'education', 'custom', 'projects', 'experience', 'certifications', 'skills', 'languages', 'interests'],
    european: ['summary', 'experience', 'education', 'languages', 'skills', 'certifications', 'projects', 'custom', 'interests'],
    technical: ['summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'custom', 'languages', 'interests'],
    creative: ['summary', 'projects', 'experience', 'skills', 'education', 'custom', 'certifications', 'languages', 'interests'],
  };
  for (const cvType of cvTypes) {
    await page.locator('#review-cv-type').selectOption(cvType);
    await expect(page).toHaveURL(/\/templates\?step=design$/);
    await expect(page.locator('.template-card')).toHaveCount(12);
    await expect(page.locator('.catalog-note')).toHaveText(es.templatesYourData);
    const oneColumn = page.locator('.template-card').filter({ hasText: es.oneColumn }).first();
    await oneColumn.locator('.template-preview-button').click();
    await expect(page).toHaveURL(/\/review$/);
    await expect(page.locator('#review-cv-type')).toHaveValue(cvType);
    await expect(page.locator('#review-template option')).toHaveCount(50);
    await expect(page.locator('#review-font-family')).toHaveValue('inter');
    const resume = page.locator('.preview-viewport article');
    await expect(resume).toContainText(fullName);
    await expect(resume).toContainText('maria.private@example.com');
    await expect(page.getByRole('checkbox', { name: es.photoShow, exact: true })).toBeChecked();
    await expect(resume.locator('.resume-photo')).toHaveAttribute('src', photoSrc!);
    await expect(resume.locator('.resume-section-experience h3')).toHaveText(['EXPERIENCIAVERIFICADA', 'ANTIGUAVERIFICADA']);
    const orderedMarkers = expectedOrder[cvType].map(section => markers[section]);
    expectMarkersInOrder(await resume.innerText(), orderedMarkers);
    const pdf = await getDownload(page, es.downloadPdf, `order-${cvType}.pdf`, testInfo);
    const pdfText = execFileSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8' });
    expectMarkersInOrder(pdfText, orderedMarkers);
    expect(pdfText.indexOf('EXPERIENCIAVERIFICADA')).toBeLessThan(pdfText.indexOf('ANTIGUAVERIFICADA'));
    expect(execFileSync('pdfimages', ['-list', pdf], { encoding: 'utf8' })).toMatch(/\bimage\b/);
    const docx = unzipSync(await readFile(await getDownload(page, es.downloadWord, `order-${cvType}.docx`, testInfo)));
    const wordXml = strFromU8(docx['word/document.xml']);
    expect(wordXml).toContain('<w:drawing>');
    const wordText = wordXml.replace(/<[^>]+>/g, '');
    expectMarkersInOrder(wordText, orderedMarkers);
    expect(wordText).toContain(fullName);
    expect(wordText).toContain('maria.private@example.com');
    expect(wordText.indexOf('EXPERIENCIAVERIFICADA')).toBeLessThan(wordText.indexOf('ANTIGUAVERIFICADA'));
  }
  await page.getByRole('link', { name: es.editAnswers, exact: true }).click();
  await expect(field(page, es.name)).toHaveValue(fullName);
  await expect(field(page, es.email)).toHaveValue('maria.private@example.com');
  await page.getByRole('button', { name: es.next, exact: true }).click();
  // Presentation sorts jobs without mutating the user's input order.
  await expect(page.locator('.entry-card').first().getByLabel(es.role, { exact: true })).toHaveValue('ANTIGUAVERIFICADA');
  await expect(page.locator('.entry-card').nth(1).getByLabel(es.role, { exact: true })).toHaveValue('EXPERIENCIAVERIFICADA');
});
