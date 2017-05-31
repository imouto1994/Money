import { LOCALES } from "../Config";

LOCALES.forEach(locale => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  require(`./json/${locale}.json`);
});
