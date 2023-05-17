import i18next from 'i18next';
import translateEn from './locales/en/translation.json';
import translateAr from './locales/ar/translation.json';

export const defaultNS = 'translation';
export const resources = {
  en: { translation: translateEn },
  ar: { translation: translateAr },
};

const i18n = i18next.init({
  returnNull: false,
  resources,
  // defaultNS,
  // lng: 'en',
  fallbackLng: ['en', 'ar'],
  interpolation: { escapeValue: false },
  supportedLngs: ['en', 'ar'],
});

export default i18n;
