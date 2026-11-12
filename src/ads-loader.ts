/** Loads Adsterra slots from public/ads.json and renders banners in isolated iframes. */

type BannerDef = { key: string; width: number; height: number };

type AdsConfig = {
  enabled?: boolean;
  bannerScriptBase?: string;
  socialBar?: string;
  popunder?: string;
  nativeBanner?: { src: string; containerId: string };
  smartlink?: { url: string; label?: string };
  banners?: Record<string, BannerDef>;
  slots?: Record<string, string>;
};

const DEFAULT_BANNER_BASE = 'https://bauval.org/22';
const SLOT_SELECTOR = '[data-ad-slot]';

let adsCache: AdsConfig | null = null;

async function loadAds(): Promise<AdsConfig> {
  if (adsCache) return adsCache;
  try {
    const res = await fetch('/ads.json', { cache: 'no-cache' });
    if (!res.ok) {
      adsCache = { enabled: false };
      return adsCache;
    }
    adsCache = (await res.json()) as AdsConfig;
  } catch {
    adsCache = { enabled: false };
  }
  return adsCache;
}

function bannerIframeSrcDoc(key: string, width: number, height: number, scriptBase: string): string {
  const atOptions = JSON.stringify({
    key,
    format: 'iframe',
    height,
    width,
    params: {},
  });
  const src = `${scriptBase.replace(/\/$/, '')}/${key}`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer-when-downgrade"></head><body style="margin:0;padding:0;overflow:hidden;background:transparent"><script type="text/javascript">var atOptions = ${atOptions};</script><script type="text/javascript" src="${src}"><\/script></body></html>`;
}

function injectExternalScript(src: string, marker: string, target: HTMLElement) {
  if (!src || document.querySelector(`script[data-ad="${marker}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.setAttribute('data-cfasync', 'false');
  script.setAttribute('data-ad', marker);
  target.appendChild(script);
}

function renderBanner(el: HTMLElement, def: BannerDef, scriptBase: string, slot: string) {
  const iframe = document.createElement('iframe');
  iframe.title = `Advertisement ${slot}`;
  iframe.width = String(def.width);
  iframe.height = String(def.height);
  iframe.className = 'ad-slot__frame';
  iframe.style.maxWidth = '100%';
  iframe.style.border = '0';
  iframe.style.height = `${def.height}px`;
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms');
  iframe.srcdoc = bannerIframeSrcDoc(def.key, def.width, def.height, scriptBase);
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';

  el.innerHTML = '';
  const label = document.createElement('div');
  label.className = 'ad-slot__label';
  label.textContent = 'Advertisement';
  el.appendChild(label);
  el.appendChild(iframe);
  el.setAttribute('data-ad-loaded', 'true');
}

function renderNative(el: HTMLElement, cfg: { src: string; containerId: string }) {
  el.innerHTML = '';
  const label = document.createElement('div');
  label.className = 'ad-slot__label';
  label.textContent = 'Advertisement';
  const container = document.createElement('div');
  container.id = cfg.containerId;
  container.className = 'ad-slot__native';
  el.appendChild(label);
  el.appendChild(container);
  el.setAttribute('data-ad-loaded', 'true');
  injectExternalScript(cfg.src, `native-${cfg.containerId}`, document.body);
}

function renderSmartlink(el: HTMLElement, link: { url: string; label?: string }) {
  el.innerHTML = '';
  const a = document.createElement('a');
  a.href = link.url;
  a.target = '_blank';
  a.rel = 'sponsored noopener noreferrer';
  a.textContent = link.label || 'Sponsored';
  el.appendChild(a);
  el.setAttribute('data-ad-loaded', 'true');
}

async function init() {
  const cfg = await loadAds();
  if (cfg.enabled === false) return;

  const scriptBase = cfg.bannerScriptBase || DEFAULT_BANNER_BASE;

  document.querySelectorAll<HTMLElement>(SLOT_SELECTOR).forEach((el) => {
    const slot = el.dataset.adSlot;
    if (!slot) return;
    const mapped = cfg.slots?.[slot] ?? slot;

    if (slot === 'smartlink' || mapped === 'smartlink') {
      if (cfg.smartlink?.url) renderSmartlink(el, cfg.smartlink);
      return;
    }

    if (mapped === 'nativeBanner' || slot === 'nativeBelowResult') {
      if (cfg.nativeBanner?.src && cfg.nativeBanner.containerId) {
        renderNative(el, cfg.nativeBanner);
      }
      return;
    }

    const def = cfg.banners?.[mapped];
    if (def?.key) renderBanner(el, def, scriptBase, slot);
  });

  if (cfg.socialBar?.trim() && !cfg.socialBar.trim().startsWith('<')) {
    injectExternalScript(cfg.socialBar.trim(), 'social-bar', document.body);
  }
  if (cfg.popunder?.trim() && !cfg.popunder.trim().startsWith('<')) {
    injectExternalScript(cfg.popunder.trim(), 'popunder', document.head);
  }
}

void init();
