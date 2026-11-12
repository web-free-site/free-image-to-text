/**
 * OCR UI — adapted from arungupta1526/ocr-tool (MIT License).
 */

import { useState, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import type { OCRFile } from './types';
import { convertPdfToImages } from './lib/pdf-utils';
import { recognizeText } from './lib/ocr';
import { FileText, Trash2, Loader2, X } from 'lucide-react';
import { CopyButton } from './components/CopyButton';
import { TextDownloadButton } from './components/TextDownloadButton';
import { LanguageSelector } from './components/LanguageSelector';
import { LayoutSelector } from './components/LayoutSelector';
import { KINYARWANDA_NOTE } from './lib/languages';
import { getUiLang, ui } from './i18n/strings';

type TabValue = 'upload' | 'process' | 'results';

function App() {
  const t = ui[getUiLang()];
  const [activeTab, setActiveTab] = useState<TabValue>('upload');
  const [files, setFiles] = useState<OCRFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState('eng');
  const [selectedColumns, setSelectedColumns] = useState(1);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const handleFilesSelected = (selectedFiles: File[]) => {
    const newFiles: OCRFile[] = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type === 'application/pdf' ? '' : URL.createObjectURL(file),
      status: 'idle',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setActiveTab('process');
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      if (updated.length === 0) setActiveTab('upload');
      return updated;
    });
  };

  const cancelFile = (id: string) => {
    abortControllers.current.get(id)?.abort();
  };

  const processFiles = async () => {
    setIsProcessing(true);

    const processedFiles = await Promise.all(
      files.map(async (ocrFile) => {
        if (ocrFile.status === 'success') return ocrFile;

        const controller = new AbortController();
        abortControllers.current.set(ocrFile.id, controller);
        const { signal } = controller;

        try {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === ocrFile.id ? { ...f, status: 'processing', progress: 0 } : f
            )
          );

          let imagesToProcess: string[] = [];

          if (ocrFile.file.type === 'application/pdf') {
            const images = await convertPdfToImages(ocrFile.file);
            if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
            imagesToProcess = images;
            setFiles((prev) =>
              prev.map((f) =>
                f.id === ocrFile.id ? { ...f, pages: images, preview: images[0] } : f
              )
            );
          } else {
            imagesToProcess = [ocrFile.preview];
          }

          let fullText = '';
          let avgConfidence = 0;
          const totalImages = imagesToProcess.length;

          for (let i = 0; i < totalImages; i++) {
            if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');

            const result = await recognizeText(
              imagesToProcess[i],
              selectedLang,
              selectedColumns,
              (progress) => {
                const base = (i / totalImages) * 100;
                const totalProgress = base + (progress / 100) * (100 / totalImages);
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === ocrFile.id ? { ...f, progress: Math.round(totalProgress) } : f
                  )
                );
              }
            );

            fullText += result.text + '\n\n';
            avgConfidence += result.confidence;
          }

          avgConfidence = avgConfidence / totalImages;
          abortControllers.current.delete(ocrFile.id);

          return {
            ...ocrFile,
            status: 'success' as const,
            progress: 100,
            result: {
              text: fullText,
              confidence: avgConfidence,
              lang: selectedLang,
              columns: selectedColumns,
            },
            pages: imagesToProcess,
          };
        } catch (error) {
          abortControllers.current.delete(ocrFile.id);
          if (error instanceof DOMException && error.name === 'AbortError') {
            return { ...ocrFile, status: 'cancelled' as const, progress: 0 };
          }
          console.error(error);
          return { ...ocrFile, status: 'error' as const, error: 'Failed to process file' };
        }
      })
    );

    setFiles(processedFiles);
    setIsProcessing(false);
    if (processedFiles.some((f) => f.status === 'success')) setActiveTab('results');
  };

  const kinNote = KINYARWANDA_NOTE[getUiLang()];

  return (
    <section className="ocr-panel" aria-label="OCR tool">
      <div className="ocr-tabs" role="tablist">
        {(['upload', 'process', 'results'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? 'ocr-tab active' : 'ocr-tab'}
            disabled={
              (tab === 'process' && files.length === 0) ||
              (tab === 'results' && !files.some((f) => f.status === 'success')) ||
              isProcessing
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'upload' && (getUiLang() === 'fr' ? 'Importer' : 'Upload')}
            {tab === 'process' && `${getUiLang() === 'fr' ? 'File' : 'Queue'} (${files.length})`}
            {tab === 'results' && (getUiLang() === 'fr' ? 'Résultat' : 'Results')}
          </button>
        ))}
      </div>

      <div className="ocr-body">
        {activeTab === 'upload' && (
          <FileUpload onFileSelect={handleFilesSelected} />
        )}

        {activeTab === 'process' && (
          <div className="process-pane">
            <form
              className="process-controls"
              onSubmit={(e) => {
                e.preventDefault();
                void processFiles();
              }}
            >
              <LayoutSelector
                value={selectedColumns}
                onChange={setSelectedColumns}
                disabled={isProcessing}
              />
              <LanguageSelector
                value={selectedLang}
                onChange={setSelectedLang}
                disabled={isProcessing}
              />
              <button type="submit" className="btn primary" disabled={isProcessing || files.length === 0}>
                {isProcessing ? (
                  <>
                    <Loader2 className="icon-sm spin" /> {t.processing}
                  </>
                ) : (
                  t.extract
                )}
              </button>
            </form>
            <p className="lang-note">{t.workerNote}</p>
            <p className="kin-note">{kinNote}</p>

            <ul className="file-queue">
              {files.map((file) => (
                <li key={file.id} className="file-row">
                  <div className="file-thumb">
                    {file.preview ? (
                      <img src={file.preview} alt="" />
                    ) : (
                      <FileText className="icon-lg" />
                    )}
                  </div>
                  <div className="file-meta">
                    <p className="file-name">{file.file.name}</p>
                    <progress max={100} value={file.progress} />
                    <span className="file-status">{Math.round(file.progress)}%</span>
                  </div>
                  {file.status === 'processing' ? (
                    <button type="button" className="icon-btn" onClick={() => cancelFile(file.id)} title={t.cancel}>
                      <X className="icon-sm" />
                    </button>
                  ) : (
                    <button type="button" className="icon-btn" onClick={() => removeFile(file.id)} title={t.remove}>
                      <Trash2 className="icon-sm" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {files.length === 0 && <p>{t.noFiles}</p>}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-pane">
            {files
              .filter((f) => f.status === 'success')
              .map((file) => (
                <article key={file.id} className="result-card">
                  <header className="result-head">
                    <strong>{file.file.name}</strong>
                    <div className="result-actions">
                      <CopyButton text={file.result?.text || ''} />
                      <TextDownloadButton text={file.result?.text || ''} filename={file.file.name} />
                    </div>
                  </header>
                  <p className="conf-line">
                    {t.confidence}: {Math.round(file.result?.confidence ?? 0)}%
                  </p>
                  <textarea readOnly value={file.result?.text ?? ''} rows={10} />
                </article>
              ))}
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setFiles([]);
                setActiveTab('upload');
              }}
            >
              {t.clearAll}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
