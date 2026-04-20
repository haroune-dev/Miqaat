import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

const isDev = import.meta.env.MODE === "development";

export default [
  index("routes/home.tsx"),
  route("/location", "routes/location-selection.tsx"),
  route("/settings", "routes/settings.tsx"),
] satisfies RouteConfig;
