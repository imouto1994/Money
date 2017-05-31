import { addLocaleData } from "react-intl";
import get from "lodash/get";

import { log } from "../utils/log";
import { LOCALES_MAP, LOCALES, BROWSER } from "../Config";

/**
 * [hasBuiltInLocaleData description]
 * @param {[type]} locale [description]
 * @return {Boolean} [description]
 */
export function hasBuiltInLocaleData(locale) {
  return get(Intl.NumberFormat.supportedLocalesOf(locale), 0) === locale
    && get(Intl.DateTimeFormat.supportedLocalesOf(locale), 0) === locale;
}

/**
 * [polyfillServerIntl description]
 * @return {[type]} [description]
 */
export function polyfillServerIntl() {
  // Ignore if function is called in browser environment
  if (BROWSER) {
    throw new Error("This function should not be called on client side");
  }
  if (LOCALES_MAP) {
    if (global.Intl) {
      if (!LOCALES.every(hasBuiltInLocaleData)) {
        // eslint-disable-next-line global-require
        const IntlPolyfill = require("intl");
        Intl.NumberFormat = IntlPolyfill.NumberFormat;
        Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
        // eslint-disable-next-line max-len
        log("Intl has been found, but locale data has been polyfilled due to missing support for one of the required locales");
      }
    }
    else {
      // eslint-disable-next-line global-require
      global.Intl = require("intl");
      log("Intl is not supported, so the polyfill has been loaded");
    }
  }
}

/**
 * [loadIntlPolyfill description]
 * @param {[type]} locale [description]
 * @return {[type]} [description]
 */
export function loadIntlPolyfill(locale) {
  if (!BROWSER) {
    throw new Error("This function should not be called on server side");
  }

  if (window.Intl && hasBuiltInLocaleData(locale)) {
    return Promise.resolve();
  }

  log(`Intl or locale data for ${locale} is not available, downloading the polyfill...`);
  return import("intl" /* webpackChunkName: "intl" */)
    .then(IntlPolyfill => {
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
      log(`Intl polyfill for ${locale} has been loaded`);
    });
}

/**
 * [loadLocaleData description]
 * @param {[type]} locale [description]
 * @return {[type]} [description]
 */
export function loadLocaleData(locale) {
  if (!BROWSER) {
    throw new Error("This function should not be called on server side");
  }
  const hasIntl = hasBuiltInLocaleData(locale);

  switch (locale) {
    case LOCALES_MAP.TAIWAN: {
      if (hasIntl) {
        return import("react-intl/locale-data/zh" /* webpackChunkName: "locale-taiwan" */)
          .then(localeData => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' has been loaded`);
          });
      }
      else {
        return Promise.all(
          import("react-intl/locale-data/zh" /* webpackChunkName: "locale-taiwan-no-intl" */),
          import("intl/locale-data/jsonp/zh-Hant-TW" /* webpackChunkName: "locale-taiwan-no-intl" */),
        )
          .then(([localeData]) => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' & 'intl' has been loaded`);
          });
      }
    }
    case LOCALES_MAP.HONGKONG: {
      if (hasIntl) {
        return import("react-intl/locale-data/zh" /* webpackChunkName: "locale-hongkong" */)
          .then(localeData => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' has been loaded`);
          });
      }
      else {
        return Promise.all(
          import("react-intl/locale-data/zh" /* webpackChunkName: "locale-hongkong-no-intl" */),
          import("intl/locale-data/jsonp/zh-Hant-HK" /* webpackChunkName: "locale-hongkong-no-intl" */),
        )
          .then(([localeData]) => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' & 'intl' has been loaded`);
          });
      }
    }
    case LOCALES_MAP.MALAY: {
      if (hasIntl) {
        return import("react-intl/locale-data/ms" /* webpackChunkName: "locale-malay" */)
          .then(localeData => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' has been loaded`);
          });
      }
      else {
        return Promise.all(
          import("react-intl/locale-data/ms" /* webpackChunkName: "locale-malay-no-intl" */),
          import("intl/locale-data/jsonp/ms" /* webpackChunkName: "locale-malay-no-intl" */),
        )
          .then(([localeData]) => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' & 'intl' has been loaded`);
          });
      }
    }
    case LOCALES_MAP.INDO: {
      if (hasIntl) {
        return import("react-intl/locale-data/id" /* webpackChunkName: "locale-indo" */)
          .then(localeData => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' has been loaded`);
          });
      }
      else {
        return Promise.all(
          import("react-intl/locale-data/id" /* webpackChunkName: "locale-indo-no-intl" */),
          import("intl/locale-data/jsonp/id-ID" /* webpackChunkName: "locale-indo-no-intl" */),
        )
          .then(([localeData]) => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' & 'intl' has been loaded`);
          });
      }
    }
    case LOCALES_MAP.KOREA: {
      if (hasIntl) {
        return import("react-intl/locale-data/ko" /* webpackChunkName: "locale-korea" */)
          .then(localeData => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' has been loaded`);
          });
      }
      else {
        return Promise.all(
          import("react-intl/locale-data/ko" /* webpackChunkName: "locale-korea-no-intl" */),
          import("intl/locale-data/jsonp/ko" /* webpackChunkName: "locale-korea-no-intl" */),
        )
          .then(([localeData]) => {
            addLocaleData(localeData);
            log(`Locale data in ${locale} for 'react-intl' & 'intl' has been loaded`);
          });
      }
    }
    default: {
      if (hasIntl) {
        return Promise.resolve();
      }
      else {
        return import("intl/locale-data/jsonp/en" /* webpackChunkName: "locale-english-no-intl" */)
          .then(() => {
            log(`Locale data in ${locale} for 'intl' has been loaded`);
          });
      }
    }
  }
}
