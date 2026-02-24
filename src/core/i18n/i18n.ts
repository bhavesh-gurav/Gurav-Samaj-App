import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import mr from './mr.json';

const resources = {
    en: { translation: en },
    mr: { translation: mr },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default statically to prevent bridge rendering crashes
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React handles XSS
        },
        react: {
            useSuspense: false,
        }
    });

// Utility to sync language safely after bridge mounts
export const syncDeviceLanguage = () => {
    try {
        const locales = Localization.getLocales();
        if (locales && locales.length > 0 && locales[0].languageCode) {
            i18n.changeLanguage(locales[0].languageCode);
        }
    } catch (e) {
        console.warn('Native Localization error', e);
    }
};

export default i18n;
