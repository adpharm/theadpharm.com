import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("services", "routes/services.tsx"),
  route("insights", "routes/insights.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-of-service", "routes/terms-of-service.tsx"),
  route("accessibility", "routes/accessibility.tsx"),
  route("api/contact", "routes/api.contact.tsx"),
  route("api/newsletter", "routes/api.newsletter.tsx"),
] satisfies RouteConfig;
