import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { getUiLang, ui } from '../i18n/strings';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const t = ui[getUiLang()];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button type="button" className="btn secondary" onClick={() => void handleCopy()}>
      {isCopied ? (
        <>
          <Check className="icon-sm" /> OK
        </>
      ) : (
        <>
          <Copy className="icon-sm" /> {t.copy}
        </>
      )}
    </button>
  );
}
