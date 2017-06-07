// Enable 'require' for Marko Template in NodeJS environment
import "marko/node-require";
import express from "express";
import markoExpress from "marko/express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import compression from "compression";
import cors from "cors";
import csurf from "csurf";
import locale from "locale";

import { blockBot } from "../middlewares/block";
import { healthCheck } from "../middlewares/health";
import { setLocale } from "../middlewares/locale";
import { LOCALES } from "../../Config";

/**
 * Setup environment for application server
 * @param {Express} app
 */
export default function(app) {
  /**
   * Let 'express' server know that it is behind a proxy
   */
  app.enable("trust proxy");

  /**
   * Logger Middleware
   */
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }

  /**
   * Security Middlewares
   */
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard("deny"));
  app.use(
    helmet.hsts({
      maxAge: 10886400000,
      preload: true,
      force: true,
    })
  );
  app.use(helmet.hidePoweredBy({ setTo: "Ruby on Rails" }));
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());

  /**
   * Parser Middlewares
   */
  app.use(bodyParser.json({ limit: "20mb" }));
  app.use(cookieParser());

  /**
   * Compression Middleware
   */
  app.use(compression());

  /**
   * FavIcon Middleware
   */
  app.use(
    favicon(path.resolve(__dirname, "../../../public/favicons/favicon.ico"))
  );

  /**
   * CORS Middleware
   */
  app.use(
    cors({
      origin: ["carousell.com"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      preflightContinue: true,
    })
  );

  /**
   *  Bot Block Middleware
   */
  app.use(blockBot);

  /**
   *  Health Check Middleware
   */
  app.get("/health/check", healthCheck);

  /**
   * Locale middlewares
   */
  // Set the default locale to empty string
  locale.Locale.default = "";
  // Assign locale to `req.locale` based on the browser settings
  app.use(locale(LOCALES));
  // Override `req.locale` from cookie or query string. This will also act as fallback if locale is not detected.
  app.use(setLocale);

  /**
   * CSURF Middleware
   */
  app.use(
    csurf({
      cookie: { path: "/" },
    })
  );

  /**
   * Static
   */
  if (process.env.NODE_ENV === "production") {
    app.use(
      "/build/client",
      express.static(path.resolve(__dirname, "../../../public/build/client"))
    );
  }

  /**
   * Marko Middleware
   */
  app.use(markoExpress());
}
