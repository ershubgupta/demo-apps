export type TranslationKey = string;
export type TranslationValues = Record<string, string | number | Date>;

export type AppTranslate = (
  key: TranslationKey,
  values?: TranslationValues
) => string;

export type Translate = AppTranslate;
