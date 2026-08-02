export const languages = [
  { code: "bg", name: "Български", eli: "bul" },
  { code: "es", name: "Español", eli: "spa" },
  { code: "cs", name: "Čeština", eli: "ces" },
  { code: "da", name: "Dansk", eli: "dan" },
  { code: "de", name: "Deutsch", eli: "deu" },
  { code: "et", name: "Eesti", eli: "est" },
  { code: "el", name: "Ελληνικά", eli: "ell" },
  { code: "en", name: "English", eli: "eng" },
  { code: "fr", name: "Français", eli: "fra" },
  { code: "ga", name: "Gaeilge", eli: "gle" },
  { code: "hr", name: "Hrvatski", eli: "hrv" },
  { code: "it", name: "Italiano", eli: "ita" },
  { code: "lv", name: "Latviešu", eli: "lav" },
  { code: "lt", name: "Lietuvių", eli: "lit" },
  { code: "hu", name: "Magyar", eli: "hun" },
  { code: "mt", name: "Malti", eli: "mlt" },
  { code: "nl", name: "Nederlands", eli: "nld" },
  { code: "pl", name: "Polski", eli: "pol" },
  { code: "pt", name: "Português", eli: "por" },
  { code: "ro", name: "Română", eli: "ron" },
  { code: "sk", name: "Slovenčina", eli: "slk" },
  { code: "sl", name: "Slovenščina", eli: "slv" },
  { code: "fi", name: "Suomi", eli: "fin" },
  { code: "sv", name: "Svenska", eli: "swe" }
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

export const pageSlugs = [
  "what-it-means",
  "does-it-apply",
  "label-content",
  "sources",
  "skill",
  "about",
  "terms",
  "privacy-cookies",
  "disclaimer",
  "open-source"
] as const;

export type PageSlug = (typeof pageSlugs)[number];

export function isLanguageCode(value: string): value is LanguageCode {
  return languages.some((language) => language.code === value);
}

export function officialActUrl(code: LanguageCode): string {
  const language = languages.find((item) => item.code === code);
  return `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/${language?.eli ?? "eng"}`;
}

export function routeFor(code: LanguageCode, slug = ""): string {
  return `/${code}/${slug ? `${slug}/` : ""}`;
}
