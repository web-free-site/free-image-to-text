/** Loads Adsterra slots from public/ads.json; empty values render nothing. */

type AdsConfig = Record<string, string>;

const SLOT_SELECTOR = '[data-ad-slot]';

async function loadAds(): Promise<AdsConfig> {
  try {
    const res = await fetch('/ads.json', { cache: 'no-cache' });
    if (!res.ok) return {};
    return (await res.json()) as AdsConfig;
  } catch {
    return {};
  }
}

function injectHtml(el: HTMLElement, code: string) {
  if (!code?.trim()) return;
  el.innerHTML = code;
  el.setAttribute('data-ad-loaded', 'true');
}

function injectScript(code: string) {
  if (!code?.trim()) return;
  const template = document.createElement('template');
  template.innerHTML = code.trim();
  const nodes = [...template.content.childNodes];
  for (const node of nodes) {
    if (node instanceof HTMLScriptElement) {
      const s = document.createElement('script');
      for (const { name, value } of [...node.attributes]) {
        s.setAttribute(name, value);
      }
      s.text = node.text;
      document.body.appendChild(s);
    } else {
      document.body.appendChild(node.cloneNode(true));
    }
  }
}

async function init() {
  const config = await loadAds();

  document.querySelectorAll<HTMLElement>(SLOT_SELECTOR).forEach((el) => {
    const key = el.dataset.adSlot;
    if (!key) return;
    const code = config[key];
    if (code) injectHtml(el, code);
  });

  if (config.socialBar) injectScript(config.socialBar);
  if (config.popunder) injectScript(config.popunder);
}

init();
