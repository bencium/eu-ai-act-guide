import type { LanguageCode } from "./languages";

export type LocaleValue = string | string[] | Record<string, string>;
export type Locale = Record<string, LocaleValue>;

const modules = import.meta.glob<Locale>("./locales/*.json", {
  eager: true,
  import: "default"
});

export function getLocale(code: LanguageCode): Locale {
  const locale = modules[`./locales/${code}.json`];
  const english = modules["./locales/en.json"];
  if (!english) throw new Error("English locale is missing");
  return locale ?? english;
}

export function text(locale: Locale, key: string): string {
  const value = locale[key];
  if (typeof value !== "string") throw new Error(`Missing locale string: ${key}`);
  return value;
}

export function list(locale: Locale, key: string): string[] {
  const value = locale[key];
  if (!Array.isArray(value)) throw new Error(`Missing locale list: ${key}`);
  return value;
}
