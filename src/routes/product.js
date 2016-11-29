import { put } from "redux-saga/effects";

import { changeComponent } from "../actions/RouteActions";
import PageProduct from "../components/PageProduct";

// eslint-disable-next-line import/prefer-default-export
export const ProductRoute = {
  path: "/p/:productId/",
  handler: {
    name: "product",
    saga: function* productRouteHandler() {
      yield put(changeComponent(PageProduct));
    },
  },
};
