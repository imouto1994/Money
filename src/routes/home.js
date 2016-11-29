// eslint-disable-next-line import/prevent-default-export
export const HomeRoute = {
  path: "/",
  handler: {
    name: "home",
    saga: function* homeRouteHandler() {
      yield "Home";
    },
  },
};
