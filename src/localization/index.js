"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = exports.defaultNS = void 0;
const i18next_1 = __importDefault(require("i18next"));
const translation_json_1 = __importDefault(require("./locales/en/translation.json"));
const translation_json_2 = __importDefault(require("./locales/ar/translation.json"));
exports.defaultNS = 'translation';
exports.resources = {
    en: { translation: translation_json_1.default },
    ar: { translation: translation_json_2.default },
};
const i18n = i18next_1.default.init({
    returnNull: false,
    resources: exports.resources,
    // defaultNS,
    // lng: 'en',
    fallbackLng: ['en', 'ar'],
    interpolation: { escapeValue: false },
    supportedLngs: ['en', 'ar'],
});
exports.default = i18n;
