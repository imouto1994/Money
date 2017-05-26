import { put } from "redux-saga/effects";
import keyMirror from "keymirror";
import mapValues from "lodash/mapValues";

import { changeComponent } from "../actions/RouteActions";
import PageHome from "../components/PageHome";
import PageProduct from "../components/PageProduct";

// Route Names
const RouteNames = mapValues(
  keyMirror({
    HOME: null,
    PRODUCT: null,
  }),
  value => value.toLowerCase(),
);

// List of application routes
const Routes = [
  {
    path: "/",
    handler: {
      name: RouteNames.HOME,
      component: PageHome,
      saga: function* homeRouteHandler({ RouteComponent }) {
        yield RouteComponent.preload();
        yield put(changeComponent(RouteComponent));
      },
    },
  },
  {
    path: "/p/:productId/",
    handler: {
      name: RouteNames.PRODUCT,
      component: PageProduct,
      saga: function* productRouteHandler({ RouteComponent }) {
        yield RouteComponent.preload();
        yield put(changeComponent(RouteComponent));
      },
    },
  },
];

// Dictionary from each route to the respective function for fetching Route Component
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
