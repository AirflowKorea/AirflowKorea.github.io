import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Korean translations
import koCommon from './locales/ko/common.json';
import koHome from './locales/ko/home.json';
import koAbout from './locales/ko/about.json';
import koEvents from './locales/ko/events.json';
import koOrganizers from './locales/ko/organizers.json';
import koContributors from './locales/ko/contributors.json';
import koChannels from './locales/ko/channels.json';

// English translations
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enEvents from './locales/en/events.json';
import enOrganizers from './locales/en/organizers.json';
import enContributors from './locales/en/contributors.json';
import enChannels from './locales/en/channels.json';

const resources = {
  ko: {
    common: koCommon,
    home: koHome,
    about: koAbout,
    events: koEvents,
    organizers: koOrganizers,
    contributors: koContributors,
    channels: koChannels
  },
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    events: enEvents,
    organizers: enOrganizers,
    contributors: enContributors,
    channels: enChannels
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    lng: 'ko',
    
    // Set default namespace to common
    defaultNS: 'common',
    ns: ['common', 'home', 'about', 'events', 'organizers', 'contributors', 'channels'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    },

    debug: process.env.NODE_ENV === 'development'
  });

export default i18n; 