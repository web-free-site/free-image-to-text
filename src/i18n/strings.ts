export type UiLang = 'en' | 'fr';

export const ui = {
  en: {
    dropTitle: 'Drop images here, paste (Ctrl+V), or browse',
    dropHint: 'JPG, PNG, WebP, PDF — batch supported',
    images: 'Images',
    pdfs: 'PDFs',
    camera: 'Use camera',
    paste: 'Paste screenshot',
    language: 'OCR language',
    columns: 'Text columns',
    extract: 'Extract text',
    processing: 'Processing…',
    clearAll: 'Clear all',
    copy: 'Copy',
    download: 'Download .txt',
    confidence: 'Confidence',
    remove: 'Remove',
    cancel: 'Cancel',
    noFiles: 'Add at least one image or PDF to start.',
    workerNote: 'First run downloads language data (~5–15 MB) from CDN.',
  },
  fr: {
    dropTitle: 'Déposez, collez (Ctrl+V) ou parcourez',
    dropHint: 'JPG, PNG, WebP, PDF — traitement par lot',
    images: 'Images',
    pdfs: 'PDF',
    camera: 'Appareil photo',
    paste: 'Coller capture',
    language: 'Langue OCR',
    columns: 'Colonnes',
    extract: 'Extraire le texte',
    processing: 'Traitement…',
    clearAll: 'Tout effacer',
    copy: 'Copier',
    download: 'Télécharger .txt',
    confidence: 'Confiance',
    remove: 'Supprimer',
    cancel: 'Annuler',
    noFiles: 'Ajoutez une image ou un PDF pour commencer.',
    workerNote: 'Le premier lancement télécharge les données de langue via CDN.',
  },
} as const;

export function getUiLang(): UiLang {
  const meta = (window as unknown as { __PAGE_META__?: { lang?: string } }).__PAGE_META__;
  return meta?.lang === 'fr' ? 'fr' : 'en';
}
