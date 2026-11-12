import { useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Camera, ClipboardPaste } from 'lucide-react';
import { cn } from '../lib/utils';
import { getUiLang, ui } from '../i18n/strings';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  className?: string;
}

export function FileUpload({ onFileSelect, className }: FileUploadProps) {
  const t = ui[getUiLang()];
  const cameraRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        onFileSelect(acceptedFiles);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
    noClick: false,
  });

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length) {
        e.preventDefault();
        onFileSelect(files);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [onFileSelect]);

  const onCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (list?.length) onFileSelect([...list]);
    e.target.value = '';
  };

  return (
    <div className={cn('upload-stack', className)}>
      <div
        {...getRootProps()}
        id="ocr-tool"
        className={cn(
          'dropzone',
          isDragActive && 'dropzone-active'
        )}
      >
        <input {...getInputProps()} />
        <div className="dropzone-icon" aria-hidden>
          <Upload className="icon-lg" />
        </div>
        <h2 className="dropzone-title">{t.dropTitle}</h2>
        <p className="dropzone-hint">{t.dropHint}</p>
        <div className="dropzone-tags">
          <span>
            <Image className="icon-sm" /> {t.images}
          </span>
          <span>
            <FileText className="icon-sm" /> {t.pdfs}
          </span>
        </div>
      </div>
      <div className="upload-actions">
        <button type="button" className="btn secondary" onClick={() => open()}>
          Browse files
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => cameraRef.current?.click()}
        >
          <Camera className="icon-sm" /> {t.camera}
        </button>
        <button type="button" className="btn secondary" onClick={() => void pasteFromClipboard(onFileSelect)}>
          <ClipboardPaste className="icon-sm" /> {t.paste}
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={onCameraChange}
        />
      </div>
    </div>
  );
}

async function pasteFromClipboard(onFileSelect: (files: File[]) => void) {
  try {
    const items = await navigator.clipboard.read();
    const files: File[] = [];
    for (const item of items) {
      for (const type of item.types) {
        if (!type.startsWith('image/')) continue;
        const blob = await item.getType(type);
        files.push(new File([blob], `pasted.${type.split('/')[1] || 'png'}`, { type }));
      }
    }
    if (files.length) onFileSelect(files);
  } catch {
    document.getElementById('ocr-tool')?.focus();
  }
}
