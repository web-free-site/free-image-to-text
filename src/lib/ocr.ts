/**
 * OCR helpers — adapted from arungupta1526/ocr-tool (MIT License).
 * Copyright (c) 2026 Arun Gupta. See LICENSE.
 */

import Tesseract from 'tesseract.js';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function sliceImage(img: HTMLImageElement, columns: number, colIndex: number): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  const sliceWidth = img.width / columns;
  canvas.width = sliceWidth;
  canvas.height = img.height;

  ctx.drawImage(
    img,
    sliceWidth * colIndex,
    0,
    sliceWidth,
    img.height,
    0,
    0,
    sliceWidth,
    img.height
  );

  return canvas.toDataURL('image/png');
}

const ocrOptions = (onProgress?: (progress: number) => void) => ({
  // Language packs load lazily from jsDelivr per language (default tesseract.js URLs).
  logger: (m: { status: string; progress: number }) => {
    if (m.status === 'recognizing text') {
      onProgress?.(m.progress * 100);
    }
  },
});

export async function recognizeText(
  imagePath: string,
  lang: string,
  columns: number = 1,
  onProgress?: (progress: number) => void
): Promise<{ text: string; confidence: number }> {
  if (columns <= 1) {
    const result = await Tesseract.recognize(imagePath, lang, ocrOptions(onProgress));
    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  }

  const img = await loadImage(imagePath);
  let fullText = '';
  let totalConfidence = 0;

  for (let i = 0; i < columns; i++) {
    const sliceDataUrl = sliceImage(img, columns, i);
    const sliceBaseProgress = (i / columns) * 100;

    const result = await Tesseract.recognize(sliceDataUrl, lang, {
      ...ocrOptions((p) => {
        onProgress?.(sliceBaseProgress + p * (100 / columns));
      }),
    });

    fullText += (i > 0 ? '\n\n' : '') + result.data.text;
    totalConfidence += result.data.confidence;
  }

  return {
    text: fullText,
    confidence: totalConfidence / columns,
  };
}
