import type { Language } from "../types";
import { pageUrl, SAME_AS, SITE_NAME, SITE_URL } from "./config";
import { getPageSeo } from "./metadata";

const JSON_LD_ID = "portfolio-jsonld";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string
): void {
  const selector =
    attribute === "name"
      ? `meta[name="${key}"]`
      : `meta[property="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

function buildPersonJsonLd(lang: Language): object {
  const seo = getPageSeo(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: seo.description,
        inLanguage: [lang === "es" ? "es" : "en"],
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl(lang)}#webpage`,
        url: pageUrl(lang),
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        inLanguage: lang === "es" ? "es" : "en",
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        url: SITE_URL,
        jobTitle:
          lang === "es"
            ? "Desarrolladora Full-Stack Creativa"
            : "Creative Full-Stack Developer",
        description: seo.description,
        sameAs: [...SAME_AS],
        knowsAbout: [
          "React",
          "TypeScript",
          "Vite",
          "WebGL",
          "UI Engineering",
          "Frontend Performance",
        ],
      },
    ],
  };
}

function upsertJsonLd(lang: Language): void {
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = JSON_LD_ID;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(buildPersonJsonLd(lang));
}

/** Actualiza title, meta, canonical, hreflang, Open Graph y JSON-LD según idioma. */
export function applyHead(lang: Language): void {
  const seo = getPageSeo(lang);
  const canonical = pageUrl(lang);

  document.documentElement.lang = lang;
  document.title = seo.title;

  upsertMeta("name", "description", seo.description);
  upsertMeta("name", "robots", "index, follow, max-image-preview:large");
  upsertMeta("name", "author", SITE_NAME);

  upsertLink("canonical", canonical);

  upsertLink("alternate", pageUrl("es"), "es");
  upsertLink("alternate", pageUrl("en"), "en");
  upsertLink("alternate", pageUrl("es"), "x-default");

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:locale", seo.ogLocale);
  upsertMeta(
    "property",
    "og:locale:alternate",
    lang === "es" ? "en_US" : "es_ES"
  );
  const ogImageUrl = `${SITE_URL}/api/og`;
  upsertMeta("property", "og:image", ogImageUrl);
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("property", "og:image:type", "image/png");
  upsertMeta("property", "og:image:alt", seo.title);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);
  upsertMeta("name", "twitter:image", ogImageUrl);

  upsertJsonLd(lang);
}

/**
 * Detecta el idioma activo leyendo primero el pathname:
 * - /en/* → 'en'
 * - /* (cualquier otra ruta) → 'es'
 * Como fallback legacy también lee el param ?lang=
 */
export function readLanguageFromUrl(): Language | null {
  // Prioridad 1: path físico (SSG multi-página)
  if (window.location.pathname.startsWith("/en")) return "en";
  // Prioridad 2: parámetro de consulta (compatibilidad retroactiva)
  const value = new URLSearchParams(window.location.search).get("lang");
  if (value === "es" || value === "en") return value;
  return null;
}

/**
 * Actualiza la URL del navegador de forma silenciosa (sin recarga) usando
 * rutas físicas para que los rastreadores SEO las indexen correctamente:
 * - 'es' → /
 * - 'en' → /en/
 */
export function writeLanguageToUrl(lang: Language): void {
  const targetPath = lang === "en" ? "/en/" : "/";
  // Solo actualizar si la ruta actual ya no es la correcta
  if (!window.location.pathname.startsWith("/en") && lang === "en") {
    window.history.replaceState(null, "", targetPath + window.location.hash);
  } else if (window.location.pathname.startsWith("/en") && lang === "es") {
    window.history.replaceState(null, "", "/" + window.location.hash);
  }
}
