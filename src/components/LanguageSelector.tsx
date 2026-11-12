import { LANGUAGES } from '../lib/languages';
import { getUiLang, ui } from '../i18n/strings';

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  const lang = getUiLang();
  const t = ui[lang];

  return (
    <label className="lang-select">
      <span>{t.language}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {lang === 'fr' ? l.labelFr : l.labelEn}
          </option>
        ))}
      </select>
    </label>
  );
}
