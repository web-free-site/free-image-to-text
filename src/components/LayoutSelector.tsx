import { getUiLang, ui } from '../i18n/strings';

interface LayoutSelectorProps {
  value: number;
  onChange: (columns: number) => void;
  disabled?: boolean;
}

export function LayoutSelector({ value, onChange, disabled }: LayoutSelectorProps) {
  const t = ui[getUiLang()];

  return (
    <label className="lang-select">
      <span>{t.columns}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
    </label>
  );
}
