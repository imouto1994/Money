import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import csurf from "csurf";

import blockBot from "../middlewares/blockBot";
import healthCheck from "../middlewares/healthCheck";

/**
 * Setup environment for application server
 */
export default function (app) {
  if (process.env.NODE_ENV === "development") {
    /* eslint-disable global-require */
    require("../../../webpack");
    /* eslint-enable global-require */
  }

  /**
   * Let 'express' server know that it is behind a proxy
   */
  app.enable("trust proxy");

  /**
   * Logger Middleware
   */
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  }
  else {
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
    }),
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
   * TODO: FavIcon Middleware
   */

  /**
   * Compression Middleware
   */
  app.use(compression());

  /**
   * CORS Middleware
   */
  app.use(
    cors({
      origin: ["carousell.com"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      preflightContinue: true,
    }),
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
   * TODO: Locale middlewares
   */

  /**
   * CSURF Middleware
   */
  app.use(
    csurf({
      cookie: { path: "/" },
    }),
  );
}
