import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLogin from '../locales/en/login.json';
import ruLogin from '../locales/ru/login.json';
import enRegister from '../locales/en/register.json';
import ruRegister from '../locales/ru/register.json';
import ruDashboard from '../locales/ru/dashboard.json';
import enDashboard from '../locales/en/dashboard.json';

const resources = {
    en: {
        dashboard: enDashboard,
        login: enLogin,
        register: enRegister,
    },
    ru: {
        dashboard: ruDashboard,
        login: ruLogin,
        register: ruRegister,
    },
};

// Устанавливаем начальный язык как 'en', если нет сохраненной локали в localStorage.
const defaultLanguage = 'en';

// Инициализация i18n без локали
if (!i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: defaultLanguage, // Местное значение будет установлено позже на клиенте
            fallbackLng: 'en',
            ns: ['login', 'register', 'dashboard'],
            defaultNS: 'login',
            interpolation: {
                escapeValue: false,
            },
        });
}

export default i18n;
