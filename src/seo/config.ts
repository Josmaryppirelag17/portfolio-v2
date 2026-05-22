/** URL canónica del sitio. Sobrescribir en producción con VITE_SITE_URL en .env */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL as string | undefined
)?.replace(/\/$/, "") || "https://josmarypirela.dev";

export const SITE_NAME = "Josmary Pirela";

export const SAME_AS = [
  "https://github.com/Josmaryppirelag17",
] as const;

/**
 * Genera la URL canónica para cada idioma usando rutas físicas:
 * - Español: https://josmarypirela.dev/
 * - Inglés:  https://josmarypirela.dev/en/
 */
export function pageUrl(lang: "es" | "en"): string {
  return lang === "en" ? `${SITE_URL}/en/` : `${SITE_URL}/`;
}
