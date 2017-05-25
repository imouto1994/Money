function generateImport(path) {
  return function getComponent() {
    return new Promise((resolve, reject) => {
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const module = require(`../components/${path}`).default;
        resolve(module);
      }
      catch (error) {
        reject(error);
      }
    });
  };
}

const Routes = [
  {
    path: "/",
    handler: {
      name: "home",
      componentPath: "PageHome",
      saga: function* homeRouteHandler() {
        yield "Home";
      },
    },
  },
  {
    path: "/p/:productId/",
    handler: {
      name: "product",
      componentPath: "PageProduct",
      saga: function* productRouteHandler() {
        yield "Product";
      },
    },
  },
];

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
