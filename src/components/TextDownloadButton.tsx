import { FileText } from 'lucide-react';
import { getUiLang, ui } from '../i18n/strings';

interface TextDownloadButtonProps {
  text: string;
  filename: string;
}

export function TextDownloadButton({ text, filename }: TextDownloadButtonProps) {
  const t = ui[getUiLang()];

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.[^/.]+$/, '') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className="btn secondary" onClick={handleDownload} disabled={!text}>
      <FileText className="icon-sm" /> {t.download}
    </button>
  );
}
