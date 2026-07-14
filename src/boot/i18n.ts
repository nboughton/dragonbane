import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = typeof messages['en'];

const savedLocale = localStorage.getItem('dragonbane_locale') || 'en';

const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
  locale: savedLocale,
  fallbackLocale: 'en',
  legacy: false,
  globalInjection: true,
  messages,
});

export default boot(({ app }) => {
  app.use(i18n);
});

export { i18n };
