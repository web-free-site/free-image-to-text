/** Shared SEO page definitions for static HTML generation. */
export const SITE_URL = 'https://free-image-to-text.web-free.site';

export const pages = [
  {
    path: '',
    file: 'index.html',
    lang: 'en',
    hreflang: 'en',
    alternateFr: '/fr/convertir-image-en-texte/',
    title: 'Free Image to Text — Private Browser OCR (No Upload)',
    description:
      'Free image to text OCR in your browser. JPG, PNG, WebP, PDF, paste and camera. English, French, Swahili. Images never leave your device.',
    h1: 'Free Image to Text',
    keyword: 'free image to text',
    breadcrumb: 'Home',
  },
  {
    path: 'fr/convertir-image-en-texte',
    file: 'fr/convertir-image-en-texte/index.html',
    lang: 'fr',
    hreflang: 'fr',
    alternateEn: '/',
    title: 'Convertir image en texte gratuit — OCR dans le navigateur',
    description:
      'Convertir une image en texte gratuitement dans le navigateur. JPG, PNG, WebP, PDF. Anglais, français, swahili. Aucun envoi sur un serveur.',
    h1: 'Convertir image en texte gratuit',
    keyword: 'convertir image en texte',
    breadcrumb: 'Accueil FR',
  },
  {
    path: 'jpg-to-text',
    file: 'jpg-to-text/index.html',
    lang: 'en',
    hreflang: 'en',
    alternateFr: '/fr/convertir-image-en-texte/',
    title: 'Free JPG to Text — Extract Text from JPEG Photos',
    description:
      'Convert JPG and JPEG photos to editable text free in your browser with Tesseract.js OCR. Batch multiple images, copy or download .txt.',
    h1: 'Free JPG to Text Converter',
    keyword: 'jpg to text',
    breadcrumb: 'JPG to Text',
  },
  {
    path: 'screenshot-to-text',
    file: 'screenshot-to-text/index.html',
    lang: 'en',
    hreflang: 'en',
    alternateFr: '/fr/convertir-image-en-texte/',
    title: 'Free Screenshot to Text — Paste from Clipboard OCR',
    description:
      'Turn screenshots into text instantly. Paste from clipboard (Ctrl+V), run local OCR, copy results. No cloud upload.',
    h1: 'Free Screenshot to Text',
    keyword: 'screenshot to text',
    breadcrumb: 'Screenshot to Text',
  },
  {
    path: 'pdf-to-text',
    file: 'pdf-to-text/index.html',
    lang: 'en',
    hreflang: 'en',
    alternateFr: '/fr/convertir-image-en-texte/',
    title: 'Free PDF to Text — OCR PDF Pages in the Browser',
    description:
      'Extract text from PDF pages locally with PDF.js and Tesseract.js. Multi-page support, download as .txt. Private and free.',
    h1: 'Free PDF Page to Text',
    keyword: 'pdf to text',
    breadcrumb: 'PDF to Text',
  },
  {
    path: 'extract-text-from-image',
    file: 'extract-text-from-image/index.html',
    lang: 'en',
    hreflang: 'en',
    alternateFr: '/fr/convertir-image-en-texte/',
    title: 'Extract Text from Image Free — Online OCR Tool',
    description:
      'Extract text from any image file online without uploading. Camera capture on mobile, batch OCR, language picker.',
    h1: 'Extract Text from Image (Free)',
    keyword: 'extract text from image',
    breadcrumb: 'Extract Text from Image',
  },
];

export function faqFor(page, lang) {
  const en = [
    {
      q: 'Is this image to text tool really free?',
      a: 'Yes. Free Image to Text runs entirely in your browser using open-source Tesseract.js. There are no upload quotas or paywalls for OCR.',
    },
    {
      q: 'Do my images leave my phone or computer?',
      a: 'No. Recognition happens on your device. We do not operate a backend that receives your files.',
    },
    {
      q: 'Which languages are supported?',
      a: 'You can load English, French, Swahili, and additional packs on demand from the language menu. Language data downloads only when you select it.',
    },
    {
      q: 'Can I convert PDF pages?',
      a: 'Yes. Each PDF page is rendered locally, then OCR runs page by page. Large scans may take longer but stay private.',
    },
    {
      q: 'Is there Kinyarwanda OCR?',
      a: 'Not yet. Tesseract does not ship an official Kinyarwanda traineddata file we could verify, so we do not offer a language option that would mislead users.',
    },
  ];
  const fr = [
    {
      q: 'Cet outil est-il vraiment gratuit ?',
      a: 'Oui. La reconnaissance utilise Tesseract.js dans votre navigateur, sans envoi de fichiers vers nos serveurs.',
    },
    {
      q: 'Mes images sont-elles envoyées en ligne ?',
      a: 'Non. Tout le traitement OCR reste sur votre appareil.',
    },
    {
      q: 'Quelles langues sont disponibles ?',
      a: 'Anglais, français, swahili et d’autres packs Tesseract chargés à la demande depuis un CDN.',
    },
    {
      q: 'Puis-je traiter un PDF ?',
      a: 'Oui, page par page, entièrement en local.',
    },
    {
      q: 'Existe-t-il un modèle kinyarwanda ?',
      a: 'Non officiellement dans tessdata pour l’instant ; nous n’affichons donc pas cette langue.',
    },
  ];
  return lang === 'fr' ? fr : en;
}

export function bodyCopy(page, lang) {
  const intro =
    lang === 'fr'
      ? `<p><strong>${page.h1}</strong> vous permet de transformer des photos, captures d'écran et pages PDF en texte modifiable, sans créer de compte et sans téléverser vos fichiers vers un cloud inconnu. Pensé pour les utilisateurs à Kigali, en Rwanda et partout dans le monde, l'outil charge les modèles de langue uniquement lorsque vous en avez besoin — ce qui garde la page légère et respecte la limite d'actifs statiques sur Cloudflare Workers.</p>
<p>Glissez-déposez des fichiers JPG, PNG ou WebP, collez une capture depuis le presse-papiers, ou utilisez l'appareil photo sur mobile. Traitez plusieurs images en lot, copiez le résultat ou téléchargez un fichier <code>.txt</code>. Pour les PDF, chaque page est convertie localement puis passée au moteur OCR.</p>
<p>Pour l'anglais, le français ou le swahili, choisissez la langue avant de lancer la reconnaissance. Le swahili est utile dans toute l'Afrique de l'Est ; le français complète l'expérience bilingue de ce site. Nous avons vérifié l'absence d'un fichier <code>rw.traineddata</code> officiel pour le kinyarwanda — nous ne proposons donc pas cette option tant qu'un modèle entraîné fiable n'existe pas.</p>`
      : `<p><strong>${page.h1}</strong> turns photos, screenshots, and PDF pages into editable text with zero server uploads. Built for privacy-conscious users in Kigali, Rwanda, and worldwide, the app keeps every pixel on your device while Tesseract.js performs optical character recognition in the browser.</p>
<p>Drop JPG, PNG, or WebP images, paste a screenshot from the clipboard, or capture a new photo on your phone. Run batch OCR on several files, then copy or download plain <code>.txt</code>. PDF support renders each page locally before recognition — handy for scans and exported documents.</p>
<p>Pick English, French, or Swahili (and more packs on demand) before you run OCR. Language files load lazily from a CDN, so the site stays fast on mobile networks. We checked for an official Kinyarwanda (<code>rw</code>/<code>kin</code>) traineddata release; none is published in the standard tessdata repository, so we do not list Kinyarwanda to avoid poor results.</p>`;

  const keyword =
    lang === 'fr'
      ? `<p>Que vous cherchiez à <em>${page.keyword}</em> pour un devoir, une facture ou une affiche, ce convertisseur gratuit reste simple : une zone de dépôt, un sélecteur de langue, une barre de progression honnête, et des actions copier/télécharger. Aucune fausse promesse de « bouton magique » — seulement de l'OCR client utile.</p>`
      : `<p>Whether you need <em>${page.keyword}</em> for schoolwork, invoices, or street signage, this free converter keeps the workflow obvious: upload or paste, choose a language, watch real progress, then copy or save text. No fake download buttons — just honest client-side OCR.</p>`;

  return intro + keyword;
}
