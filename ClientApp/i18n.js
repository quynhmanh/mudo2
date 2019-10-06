import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const backendOpts = {
    loadPath: `/locales/{{lng}}/{{ns}}.json`
}

i18n.use(XHR)
.use(LanguageDetector)
.use(initReactI18next)
.init({
  ns: ['homePage', 'editor'],
  defaultNS: 'homePage',
  debug: true,
  fallbackLng: 'en',
  load: "languageOnly",
  backend: backendOpts
});
export default i18n; 