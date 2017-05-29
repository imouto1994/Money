import { put } from "redux-saga/effects";

import { changeComponent } from "../actions/RouteActions";
import PageHome from "../components/PageHome";
import PageProduct from "../components/PageProduct";

// List of application routes
const Routes = [
  {
    path: "/",
    handler: {
      name: "home",
      component: PageHome,
      * saga({ RouteComponent }) {
        yield RouteComponent.preload();
        yield put(changeComponent(RouteComponent));
      },
    },
  },
  {
    path: "/p/:productId/",
    handler: {
      name: "product",
      component: PageProduct,
      * saga({ RouteComponent }) {
        yield RouteComponent.preload();
        yield put(changeComponent(RouteComponent));
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
