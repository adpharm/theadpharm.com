import { createSelectSchema } from "drizzle-zod";
import { z } from "astro:schema";
import { tablePlinkoGameRounds } from "@/db/schema";

/*************************************************************************************
 *
 *
 * User
 *
 *
 ************************************************************************************/
export const usernameSchema = z
  .string()
  .min(2, {
    message: "Username must be at least 2 characters",
  })
  .max(50, {
    message: "Username must be less than 50 characters",
  });
export const emailSchema = z
  .string()
  .email({ message: "Please double-check your email" });
export const firstNameSchema = z.string().max(50);
export const lastNameSchema = z.string().max(50);
export const passwordSchema = z.string().max(50);

export const createFullUserSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export const createGuestUserSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema,
  password: passwordSchema.optional(),
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
});

export const signInUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

/***********************************************************************************
 *
 *
 * Plinko
 *
 *
 ************************************************************************************/
export const upgradePlinkoGameKeys = ["add1Ball", "makeRandomBallGolden"] as const;

export const upgradePlinkoGameSchema = z
  .object({
    // the current round data
    roundData: createSelectSchema(tablePlinkoGameRounds),

    // the upgrade key
    upgradeKey: z.enum(upgradePlinkoGameKeys, {
      message: "Please select an upgrade",
    }),

    // the upgrade values
    add1Ball: z.boolean().optional(),
    makeRandomBallGolden: z.boolean().optional(),
    // makeLastBallGolden: z.boolean().optional(),
    // satisfies: make sure each upgrade has at least one value
  } satisfies Record<
    "roundData" | "upgradeKey" | (typeof upgradePlinkoGameKeys)[number],
    any
  >)
  // minimally, one upgrade must be defined
  .refine(
    (data) => {
      for (const key of upgradePlinkoGameKeys) {
        if (data.upgradeKey === key && data[key] !== undefined) {
          return true;
        }
      }
    },
    {
      path: ["upgradeKey"],
      message: "The upgrade is broken. Please choose another one for now.",
    },
  );
