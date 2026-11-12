# Free Image to Text

Privacy-first OCR for [free-image-to-text.web-free.site](https://free-image-to-text.web-free.site), built for Gentil M. (Kigali, Rwanda).

## Upstream base (MIT)

| Item | Value |
|------|--------|
| **Repository** | [arungupta1526/ocr-tool](https://github.com/arungupta1526/ocr-tool) |
| **Stars** | ~2 (small but focused; actively structured for browser OCR + PDF) |
| **License** | MIT (see `LICENSE`) |
| **Why chosen** | Permissive MIT license, fully client-side Tesseract.js + PDF.js, batch images, TypeScript/Vite — fits Workers static hosting without AGPL constraints. Larger star projects (e.g. AlejandroAkbal/Image-to-Text-OCR, ~276★) use **AGPL-3.0**, which would require source offer for network use. |

This project retains the upstream MIT `LICENSE` and credits **Tesseract.js** ([naptha/tesseract.js](https://github.com/naptha/tesseract.js), Apache-2.0) in the site footer/about.

### Kinyarwanda

Official Tesseract `tessdata` does **not** ship `rw.traineddata` / `kin` (verified 404 on CDN). No Kinyarwanda option is exposed until a real traineddata exists.

## Features

- JPG / PNG / WebP, PDF pages, clipboard paste, mobile camera
- Languages: English, French, Swahili (+ optional packs, lazy-loaded from jsDelivr CDN)
- Batch images, copy / download `.txt`
- Images never leave the device

## SEO pages (prerendered HTML)

- `/`
- `/fr/convertir-image-en-texte/`
- `/jpg-to-text/`
- `/screenshot-to-text/`
- `/pdf-to-text/`
- `/extract-text-from-image/`
- `/privacy/`, `/terms/`, `/about/`, `/contact/`

Each includes unique title/meta, H1, ~300–600 words, FAQ, JSON-LD (WebApplication, FAQPage, BreadcrumbList), canonical, hreflang (EN/FR), `sitemap.xml`, `robots.txt`.

## Adsterra (`public/ads.json`)

Empty string = slot renders nothing. Fields for the owner’s assistant:

| JSON key | Placement |
|----------|-----------|
| `headerBanner728x90` | Header (all pages) |
| `homepageTop728x90` | Reserved: top of homepage (same header slot on `/`) |
| `betweenToolAndContent728x90` | Between OCR tool and article |
| `desktopSidebar160x600` | Desktop sidebar |
| `mobileSticky320x50` | Fixed bottom mobile banner |
| `nativeBelowResult` | Below FAQ / near results |
| `banner468x60` | Optional mid-page banner (sidebar stack) |
| `rectangle300x250` | Sidebar rectangle |
| `socialBar` | Site-wide script HTML |
| `popunder` | Site-wide script HTML |

**Do not** set COEP/COOP headers (they block ad iframes).

## Build & deploy (Cloudflare Workers)

```bash
npm ci
npx wrangler deploy
```

`npx wrangler deploy` runs `prebuild` → `build` automatically if you use:

```bash
npm run deploy
```

Worker name: `free-image-to-text`  
Account ID: `c26dbba499d049a1051c152c720cf4c5`  
Custom domain: `free-image-to-text.web-free.site` (`custom_domain = true` in `wrangler.toml`)

Local preview:

```bash
npm run dev
```

## Contact

Gentil M. — [gentil.quevvy.com](https://gentil.quevvy.com) — gentil@quevvy.com
