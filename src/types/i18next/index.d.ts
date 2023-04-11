import 'i18next';
import { defaultNS, resources } from '../../localization/index';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
    returnNull: false;
  }
}
