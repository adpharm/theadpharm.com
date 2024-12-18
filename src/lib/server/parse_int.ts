import { z } from "astro:schema";

export function requireNum<T = number>(
  value: unknown,
  options?: {
    defaultValue?: T;
  },
): number | T {
  const num = z.coerce.number().safeParse(value);

  // if it's a number, return it
  if (num.success) return num.data;

  // if defaultValue is provided, return it
  if (options?.defaultValue !== undefined && options?.defaultValue !== null)
    return options.defaultValue;

  // otherwise, throw an error
  throw new Error(`requireNum expected a number, got ${value}`);
}
