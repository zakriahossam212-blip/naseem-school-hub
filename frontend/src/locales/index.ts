/**
 * Locales Export
 * Central point for all language translations
 */

export { ar, type ArTranslation } from "./ar";
export { en, type EnTranslation } from "./en";

// Type for all translations
export type Translations = typeof import("./ar").ar;
