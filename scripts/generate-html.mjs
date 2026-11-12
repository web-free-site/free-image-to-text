import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, SITE_URL, faqFor, bodyCopy } from './pages-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const POPUNDER_SRC = 'https://abscloud.org/1/606e0592a5d0c1d4c040ceb5ca64f973';
const SOCIAL_BAR_SRC = 'https://bauval.org/14/6a1d4d9d7fb779dca289ba46f06c2051';
const SMARTLINK_URL = 'https://araplhn.org/4/7c92b4cacfd5aefe41721f826cf5f779';

const adScripts = `
    <script data-cfasync="false" data-ad="popunder" src="${POPUNDER_SRC}"></script>
    <script data-cfasync="false" data-ad="social-bar" src="${SOCIAL_BAR_SRC}"></script>`;

function canonicalFor(page) {
  return page.path ? `${SITE_URL}/${page.path}/` : `${SITE_URL}/`;
}

function jsonLd(page, lang) {
  const url = canonicalFor(page);
  const faq = faqFor(page, lang);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: page.title.split('—')[0].trim(),
      url,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: page.description,
      browserRequirements: 'Requires JavaScript. Images processed locally.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: page.breadcrumb,
          item: url,
        },
      ],
    },
  ];
}

function render(page) {
  const lang = page.lang;
  const canonical = canonicalFor(page);
  const faq = faqFor(page, lang);
  const faqHtml = faq
    .map(
      (f) =>
        `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`
    )
    .join('\n');

  const hreflang =
    page.lang === 'fr'
      ? `<link rel="alternate" hreflang="en" href="${SITE_URL}/" />
    <link rel="alternate" hreflang="fr" href="${SITE_URL}/fr/convertir-image-en-texte/" />
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`
      : `<link rel="alternate" hreflang="en" href="${SITE_URL}/" />
    <link rel="alternate" hreflang="fr" href="${SITE_URL}/fr/convertir-image-en-texte/" />
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`;

  const langSwitch =
    lang === 'fr'
      ? `<a href="/" hreflang="en">English</a>`
      : `<a href="/fr/convertir-image-en-texte/" hreflang="fr">Français</a>`;

  const navLinks =
    lang === 'fr'
      ? `<a href="/fr/convertir-image-en-texte/">Outil</a>
         <a href="/about/">À propos</a>
         <a href="/privacy/">Confidentialité</a>
         <a href="/contact/">Contact</a>`
      : `<a href="/">Tool</a>
         <a href="/jpg-to-text/">JPG</a>
         <a href="/pdf-to-text/">PDF</a>
         <a href="/about/">About</a>
         <a href="/privacy/">Privacy</a>
         <a href="/contact/">Contact</a>`;

  const footerLegal =
    lang === 'fr'
      ? `OCR par <a href="https://github.com/naptha/tesseract.js" rel="noopener noreferrer">Tesseract.js</a>.
         Basé sur <a href="https://github.com/arungupta1526/ocr-tool" rel="noopener noreferrer">ocr-tool</a> (MIT).
         <a href="/privacy/">Confidentialité</a> · <a href="/terms/">Conditions</a> · <a href="/about/">À propos</a>`
      : `OCR powered by <a href="https://github.com/naptha/tesseract.js" rel="noopener noreferrer">Tesseract.js</a>.
         Based on <a href="https://github.com/arungupta1526/ocr-tool" rel="noopener noreferrer">ocr-tool</a> (MIT).
         <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="/about/">About</a>`;

  const pageMeta = JSON.stringify({
    lang,
    path: page.path,
    h1: page.h1,
    keyword: page.keyword,
  });

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <link rel="canonical" href="${canonical}" />
    ${hreflang}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:site_name" content="Free Image to Text" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,600&display=swap" rel="stylesheet" />
    <script type="application/ld+json">${JSON.stringify(jsonLd(page, lang))}</script>
  </head>
  <body>
    <a class="skip-link" href="#ocr-tool">Skip to OCR tool</a>
    <header class="site-header">
      <div class="ad-slot ad-header" data-ad-slot="headerBanner728x90"></div>
      <div class="header-inner">
        <a class="logo" href="${lang === 'fr' ? '/fr/convertir-image-en-texte/' : '/'}">Free Image to Text</a>
        <nav class="site-nav" aria-label="Main">${navLinks}</nav>
        <div class="lang-switch">${langSwitch}</div>
      </div>
      ${page.path === '' ? '<div class="ad-slot ad-home-top" data-ad-slot="homepageTop728x90"></div>' : ''}
    </header>
    <main class="layout-main">
      <div class="tool-column">
        <h1 class="page-title">${page.h1}</h1>
        <p class="privacy-badge">${lang === 'fr' ? 'Vos images ne quittent jamais cet appareil.' : 'Your images never leave this device.'}</p>
        <div id="root" data-page-h1="${page.h1}"></div>
        <div class="ad-slot ad-between" data-ad-slot="betweenToolAndContent728x90"></div>
        <article class="seo-body">
          ${bodyCopy(page, lang)}
          <div class="ad-slot ad-mid" data-ad-slot="banner468x60"></div>
          <h2>${lang === 'fr' ? 'Questions fréquentes' : 'Frequently asked questions'}</h2>
          <div class="faq-list">${faqHtml}</div>
        </article>
        <div class="ad-slot ad-native" data-ad-slot="nativeBelowResult"></div>
      </div>
      <aside class="sidebar-ads" aria-label="Advertisement">
        <div class="ad-slot ad-sidebar" data-ad-slot="desktopSidebar160x600"></div>
        <div class="ad-slot ad-sidebar-short" data-ad-slot="banner160x300"></div>
        <div class="ad-slot ad-rect" data-ad-slot="rectangle300x250"></div>
      </aside>
    </main>
    <div class="ad-slot ad-mobile-sticky" data-ad-slot="mobileSticky320x50"></div>
    <footer class="site-footer">
      <p>by <a href="https://gentil.quevvy.com" rel="author">Gentil M.</a> · <a href="mailto:gentil@quevvy.com">gentil@quevvy.com</a></p>
      <p class="footer-legal">${footerLegal}</p>
      <p class="ad-smartlink" data-ad-slot="smartlink"><a href="${SMARTLINK_URL}" target="_blank" rel="sponsored noopener noreferrer">Sponsored</a></p>
    </footer>
    <script>window.__PAGE_META__ = ${pageMeta};</script>
    <script type="module" src="/src/main.tsx"></script>
    ${adScripts}
  </body>
</html>`;
}

for (const page of pages) {
  const out = join(root, page.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(page));
}

// Legal static pages
const legal = [
  {
    file: 'privacy/index.html',
    title: 'Privacy Policy — Free Image to Text',
    body: `<h1>Privacy Policy</h1>
<p>Free Image to Text processes images and PDFs in your browser. We do not receive, store, or analyze your uploads on our servers.</p>
<p>Language data for OCR may be downloaded from public CDNs (for example jsDelivr) when you select a language. Ad partners (Adsterra, when configured) may set cookies per their policies — see ads loaded from <code>/ads.json</code>.</p>
<p>Contact: <a href="mailto:gentil@quevvy.com">gentil@quevvy.com</a>. Operator: Gentil M., Kigali, Rwanda.</p>`,
  },
  {
    file: 'terms/index.html',
    title: 'Terms of Use — Free Image to Text',
    body: `<h1>Terms of Use</h1>
<p>This free tool is provided "as is" without warranty. OCR accuracy depends on image quality and Tesseract models. You are responsible for lawful use of extracted text.</p>
<p>Do not use the site for unlawful content. We may update these terms; continued use means acceptance.</p>`,
  },
  {
    file: 'about/index.html',
    title: 'About — Free Image to Text',
    body: `<h1>About Free Image to Text</h1>
<p>Free Image to Text is a privacy-first OCR web app for Gentil M. (<a href="https://gentil.quevvy.com">gentil.quevvy.com</a>), based in Kigali, Rwanda. It builds on the MIT-licensed <a href="https://github.com/arungupta1526/ocr-tool">ocr-tool</a> project and <a href="https://github.com/naptha/tesseract.js">Tesseract.js</a>.</p>
<p>Images never leave your device. The site is free to use and supported by ethical Adsterra placements when enabled.</p>`,
  },
  {
    file: 'contact/index.html',
    title: 'Contact — Free Image to Text',
    body: `<h1>Contact</h1>
<p>Email <a href="mailto:gentil@quevvy.com">gentil@quevvy.com</a> for feedback, takedowns, or ad configuration help.</p>`,
  },
];

for (const p of legal) {
  const out = join(root, p.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(
    out,
    `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${p.title}</title><link rel="canonical" href="${SITE_URL}/${p.file.replace('/index.html', '')}/"/><link rel="alternate" hreflang="en" href="${SITE_URL}/${p.file.replace('/index.html', '')}/"/><link rel="alternate" hreflang="x-default" href="${SITE_URL}/${p.file.replace('/index.html', '')}/"/></head><body class="legal-page"><header class="site-header"><div class="ad-slot ad-header" data-ad-slot="headerBanner728x90"></div><p class="logo"><a href="/">Free Image to Text</a></p></header><main class="legal-main">${p.body}<div class="ad-slot ad-content" data-ad-slot="content300x250"></div></main><footer class="site-footer"><p>by <a href="https://gentil.quevvy.com">Gentil M.</a></p><p class="ad-smartlink" data-ad-slot="smartlink"><a href="${SMARTLINK_URL}" target="_blank" rel="sponsored noopener noreferrer">Sponsored</a></p></footer><div class="ad-slot ad-mobile-sticky" data-ad-slot="mobileSticky320x50"></div><script type="module" src="/src/legal.ts"></script>${adScripts}</body></html>`
  );
}

// sitemap
const urls = [
  ...pages.map((p) => canonicalFor(p)),
  ...['privacy', 'terms', 'about', 'contact'].map((s) => `${SITE_URL}/${s}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
writeFileSync(join(root, 'public/sitemap.xml'), sitemap);

// 404
writeFileSync(
  join(root, '404.html'),
  `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><title>Not found — Free Image to Text</title><link rel="stylesheet" href="/src/index.css"/></head><body><main class="legal-main"><h1>404</h1><p><a href="/">Back to Free Image to Text</a></p></main></body></html>`
);

console.log(`Generated ${pages.length} OCR pages + legal + sitemap`);
