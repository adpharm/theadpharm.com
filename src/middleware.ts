import { defineMiddleware, sequence } from "astro:middleware";
import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from "@/lib/server/session";
import { TokenBucketRateLimit } from "@/lib/server/actions.rateLimit";

const ratelimit = new TokenBucketRateLimit<string>(100, 1);

const rateLimitMiddleware = defineMiddleware((context, next) => {
  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = context.request.headers.get("X-Forwarded-For");
  if (clientIP === null) {
    return next();
  }
  let cost: number;
  if (
    context.request.method === "GET" ||
    context.request.method === "OPTIONS"
  ) {
    cost = 1;
  } else {
    cost = 3;
  }
  if (!ratelimit.consume(clientIP, cost)) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  return next();
});

const authMiddleware = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("session")?.value ?? null;

  if (token === null) {
    context.locals.session = null;
    context.locals.user = null;

    return next();
  }

  const { user, session } = await validateSessionToken(token);

  if (session !== null) {
    await setSessionTokenCookie(context, token, session.expires_at);
  } else {
    await deleteSessionTokenCookie(context);
  }

  context.locals.session = session;
  context.locals.user = user;
  return next();
});

export const onRequest = sequence(rateLimitMiddleware, authMiddleware);