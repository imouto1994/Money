import { delay } from "redux-saga";
import { put, call } from "redux-saga/effects";

import { changeComponent } from "../actions/RouteActions";
import PageHome from "../components/PageHome";
import PageProduct from "../components/PageProduct";
import { executeMultiple } from "../utils/saga";

// List of application routes
const Routes = [
  {
    path: "/",
    handler: {
      name: "home",
      component: PageHome,
      saga({ RouteComponent }) {
        return executeMultiple({
          preload: RouteComponent.preload,
          updateComponent: [
            "preload",
            put(changeComponent(RouteComponent)),
          ],
        });
      },
    },
  },
  {
    path: "/p/:productId/",
    handler: {
      name: "product",
      component: PageProduct,
      saga({ RouteComponent }) {
        return executeMultiple({
          preload: RouteComponent.preload,
          delay: call(delay, 3000),
          updateComponent: [
            "preload",
            "delay",
            put(changeComponent(RouteComponent)),
          ],
        });
      },
    },
  },
];

// Dictionary from each route to its respective component to be displayed
const RouteComponentMap = Routes.reduce(
  (m, route) => {
    // eslint-disable-next-line no-param-reassign
    m[route.handler.name] = route.handler.component;
    return m;
  },
  {},
);

function getRouteComponent(routeName) {
  return RouteComponentMap[routeName];
}

export { Routes, getRouteComponent };
