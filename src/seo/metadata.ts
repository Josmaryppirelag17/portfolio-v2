import type { Language } from "../types";

export interface PageSeo {
  title: string;
  description: string;
  ogLocale: string;
}

const seoByLang: Record<Language, PageSeo> = {
  es: {
    title: "Josmary Pirela | Desarrolladora Full-Stack Creativa (React)",
    description:
      "Portfolio de Josmary Pirela: interfaces interactivas, React, Vite y experiencias web de alto rendimiento. Proyectos, trayectoria y contacto.",
    ogLocale: "es_ES",
  },
  en: {
    title: "Josmary Pirela | Creative Full-Stack Developer (React)",
    description:
      "Portfolio of Josmary Pirela: interactive UIs, React, Vite, and high-performance web experiences. Projects, experience, and contact.",
    ogLocale: "en_US",
  },
};

export function getPageSeo(lang: Language): PageSeo {
  return seoByLang[lang];
}
