/**
 * Tesseract language packs loaded lazily from CDN when selected.
 * Kinyarwanda: no official rw/swa_alt traineddata in tessdata (verified 404 on CDN) — not listed.
 */
export const LANGUAGES = [
  { code: 'eng', labelEn: 'English', labelFr: 'Anglais' },
  { code: 'fra', labelEn: 'French', labelFr: 'Français' },
  { code: 'swa', labelEn: 'Swahili', labelFr: 'Swahili' },
  { code: 'eng+fra', labelEn: 'English + French', labelFr: 'Anglais + Français' },
  { code: 'deu', labelEn: 'German', labelFr: 'Allemand' },
  { code: 'spa', labelEn: 'Spanish', labelFr: 'Espagnol' },
  { code: 'por', labelEn: 'Portuguese', labelFr: 'Portugais' },
  { code: 'ara', labelEn: 'Arabic', labelFr: 'Arabe' },
];

export const KINYARWANDA_NOTE = {
  en: 'Kinyarwanda (kin/rw) is not available in the official Tesseract traineddata repository at this time, so we cannot offer a trustworthy Kinyarwanda model.',
  fr: "Le kinyarwanda (kin/rw) n'est pas disponible dans le dépôt officiel traineddata de Tesseract pour l'instant ; nous ne proposons donc pas de modèle fiable.",
};
