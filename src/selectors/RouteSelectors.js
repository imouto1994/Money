export function getRouteName(store) {
  return store.Route.get("name");
}

export function getRouteComponent(store) {
  return store.Route.get("component");
}
