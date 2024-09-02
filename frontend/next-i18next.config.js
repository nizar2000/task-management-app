const i18n = require('i18next');
const { initReactI18next } = require('react-i18next');
const enTranslation = require('./public/locales/en/common.json');
const arTranslation = require('./public/locales/ar/common.json');
const frTranslation = require('./public/locales/fr/common.json');

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enTranslation },
      ar: { common: arTranslation },
      fr: { common: frTranslation },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

module.exports = {
  i18n: {
    locales: ['en', 'ar', 'fr'],
    defaultLocale: 'en',
  },
};
