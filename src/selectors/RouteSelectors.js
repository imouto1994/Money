const routeNameSelector = store => store.Route.get("name");
const routeComponentSelector = store => store.Route.get("component");
const routeUrlSelector = store => store.Route.get("url");

export { routeNameSelector, routeComponentSelector, routeUrlSelector };
