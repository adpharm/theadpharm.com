import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, useLoaderData, useLocation } from "react-router";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import { browserPageEvent } from "~/lib/analytics/events.defaults.client";
import { useI18n } from "~/hooks/use-i18n";
import { getPreferencesFromRequest } from "~/lib/preferences/preference-cookie.server";

import type { Route } from "./+types/root";
import "./app.css";

export async function loader({ request }: Route.LoaderArgs) {
  return {
    env: {
      PUBLIC_APP_ENV: process.env.PUBLIC_APP_ENV ?? "development",
      PUBLIC_APP_FQDN: process.env.PUBLIC_APP_FQDN ?? "",
    },
    preferences: getPreferencesFromRequest(request),
  };
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {data && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.env = ${JSON.stringify(data.env)}`,
            }}
          />
        )}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);
  
  return null;
}

function PageTracker() {
  const { language } = useI18n();
  const location = useLocation();

  const triggerPageEvent = useDebouncedCallback(
    () => {
      browserPageEvent({ language });
    },
    1000,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    triggerPageEvent();
  }, [location.pathname, language]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PageTracker />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
