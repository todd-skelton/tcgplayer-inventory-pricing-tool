import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("help", "./routes/help/help.tsx"),
] satisfies RouteConfig;
