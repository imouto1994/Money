import { connect } from "react-redux";

import Application from "./Application";

function selectFromStore(store) {
  return {
    pageComponent: store.Route.get("element"),
  };
}

export default connect(selectFromStore)(Application);
