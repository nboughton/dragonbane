import { boot } from 'quasar/wrappers';
import Tres from '@tresjs/core';

export default boot(async ({ app }) => {
  app.use(Tres);
});
