import { LOCALES } from "../../Config";

/**
 * Middleware to attach the locale for request
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next - callback to pass to the next middleware
 */
export function setLocale(req, res, next) {
  // eslint-disable-next-line no-console
  console.log(`Detected locale from browser: ${req.locale}`);

  // Locale can be overridden by passing ?hl=<locale> in the querystring
  if (req.query.hl) {
    // But only the supported ones!
    if (LOCALES.indexOf(req.query.hl) > -1) {
      req.locale = req.query.hl;
      // eslint-disable-next-line no-console
      console.log(`Locale has been overridden from querystring: ${req.locale}`);
    }
  } else if (req.cookies.hl) {
    // Locale can also be overidden by setting a `hl` cookie
    if (LOCALES.indexOf(req.cookies.hl) > -1) {
      req.locale = req.cookies.hl;
      // eslint-disable-next-line no-console
      console.log(`Locale has been overidden from cookie: ${req.locale}`);
    }
  }

  // If req.locale is empty string by default, we will set default to subdomain if exists or "en"
  if (req.locale === "") {
    let subdomainLang = req.get("X-Subdomain-Lang");
    if (subdomainLang === "zh_tw") {
      subdomainLang = "zh-Hant-TW";
    } else if (subdomainLang === "zh_hk") {
      subdomainLang = "zh-Hant-HK";
    }
    req.locale = subdomainLang || "en";
  }
  // Forward to the next middleware
  next();
}
