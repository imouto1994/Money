import { put } from "redux-saga/effects";

import { changeComponent } from "../actions/RouteActions";
import { BROWSER } from "../Config";

function generateImport(path) {
  return function getComponent() {
    if (BROWSER) {
      return import(`../components/${path}/index.js`)
        .then(res => res.default);
    }
    else {
      return new Promise((resolve, reject) => {
        try {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          const module = require(`..//components/${path}`).default;
          resolve(module);
        }
        catch (error) {
          reject(error);
        }
      });
    }
  };
}

// List of routes
const Routes = [
  {
    path: "/",
    handler: {
      name: "home",
      componentPath: "PageHome",
      saga: function* homeRouteHandler({ requireComponent }) {
        const PageHome = yield requireComponent();
        yield put(changeComponent(PageHome));
      },
    },
  },
  {
    path: "/p/:productId/",
    handler: {
      name: "product",
      componentPath: "PageProduct",
      saga: function* productRouteHandler({ requireComponent }) {
        const PageProduct = yield requireComponent();
        yield put(changeComponent(PageProduct));
      },
    },
  },
];

// Dictionary from each route to function to fetch its corresponding Component
const RouteComponentMap = Routes.reduce(
  (m, route) => {
    // eslint-disable-next-line no-param-reassign
    m[route.handler.name] = generateImport(route.handler.componentPath);
    return m;
  },
  {},
);

function getRequireComponent(routeName) {
  return RouteComponentMap[routeName];
}

export { Routes, getRequireComponent };
