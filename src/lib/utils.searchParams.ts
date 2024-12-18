import { z } from "astro:schema";
import type { $router } from "./stores/router";
import type { Expand, Nullable, Optional } from "./utils.types";
import { logWarn } from "./utils.logger";

const appSearchSchema = z.object({
  fakeList: z.array(z.number()),

  guest: z.object({
    email: z.string().email(),
    code: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
});

type AppSearchParams = Nullable<z.infer<typeof appSearchSchema>>;

// type AppSearchParams = Nullable<{
//   fakeList: number[];
//   /**
//    * email (base64 decoded) if valid, or null
//    */
//   // e: string;
//   /**
//    * code to skip allow guest account creation
//    */
//   // guest: string;
//   guest: {
//     email: string;
//     code: string;
//     first_name: string;
//     last_name: string;
//   };
// }>;

const parseTo: {
  [K in keyof AppSearchParams]: (
    value: string | null | undefined,
  ) => AppSearchParams[K];
} = {
  fakeList: parseToList,
  // e: (val) => parseToEmail(parseFromBase64(val)),
  // guest: parseToString,
  guest: (val) => parseToObject(val, appSearchSchema.shape.guest),
};

const parseFrom: {
  [K in keyof AppSearchParams]: (value: AppSearchParams[K]) => string | null;
} = {
  fakeList: parseFromList,
  // e: (val) => parseToBase64(val),
  // guest: parseFromString,
  guest: (val) => parseFromObject(val, appSearchSchema.shape.guest),
};

type AppSearchParamsPartial = Optional<AppSearchParams>;

/**
 * given a router, parse the search params
 * @param router
 * @returns
 */
export function parseRouterSearch(
  router: typeof $router.value,
): Expand<AppSearchParams> {
  const search = router?.search || {};

  return Object.fromEntries(
    Object.entries(parseTo).map(([key, parser]) => [key, parser(search[key])]),
  ) as Expand<AppSearchParams>;
}

/**
 * update the search params in the current url
 */
export function updateSearchParams(
  router: typeof $router.value,
  params: Expand<AppSearchParamsPartial>,
) {
  const currentSearch = router?.search || {};

  // loop through the params
  for (const key_ in params) {
    const key = key_ as keyof typeof params;
    const value = params[key];

    // if the value to update is undefined, do nothing
    if (value === undefined) continue;

    // if the value to update is null, remove the key from the search
    if (value === null) {
      delete currentSearch[key];
      continue;
    }

    // if the value to update is not null, update the key in the search
    if (value !== null) {
      const parsedVal = parseFrom[key](value as any);
      if (parsedVal !== null) currentSearch[key] = parsedVal;
    }
  }
}

/**
 * util functions
 */
// parse to string (no op)
function parseToString(value: string | null | undefined): string | null {
  return value ?? null;
}

// parse from string (no op)
function parseFromString(value: string | null | undefined): string | null {
  return value ?? null;
}

// parse from base64
function parseFromBase64(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;

  // try to decode the value
  try {
    return atob(value);
  } catch (e) {
    return null;
  }
}

// parse to base64
function parseToBase64(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;

  // try to encode the value
  try {
    return btoa(value);
  } catch (e) {
    return null;
  }
}

// parse to email
function parseToEmail(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;

  const parsedEmail = z.string().email().safeParse(value);

  if (!parsedEmail.success) {
    logWarn("Failed to parse email", { value, parsedEmail });
    return null;
  }

  return parsedEmail.data;
}

// parse from list
function parseFromList(value: unknown[] | null | undefined): string | null {
  if (value === null || value === undefined) return null;

  return value.map((v) => JSON.stringify(v)).join(",");
}

// parse to list
function parseToList<T>(value: string | null | undefined): T[] | null {
  if (value === null || value === undefined) return null;

  return value.split(",").map((v) => JSON.parse(v));
}

// parse from json
function parseFromObject<T>(
  value: T | null | undefined,
  schema: z.ZodType<T>,
): string | null {
  if (value === null || value === undefined) return null;

  const parsedObj = schema.safeParse(value);

  if (!parsedObj.success) {
    logWarn("Failed to parse object", { value, parsedObj });
    return null;
  }

  return JSON.stringify(parsedObj.data);
}

// parse to json
function parseToObject<T>(
  value: string | null | undefined,
  schema: z.ZodType<T>,
): T | null {
  if (value === null || value === undefined) return null;

  // try to parse the value
  try {
    const obj = JSON.parse(value);

    const parsedObj = schema.safeParse(obj);

    if (!parsedObj.success) {
      logWarn("Failed to parse object", { value, parsedObj });
      return null;
    }

    return parsedObj.data;
  } catch (e) {
    logWarn("Failed to parse object in search params, got", value);
    return null;
  }
}
