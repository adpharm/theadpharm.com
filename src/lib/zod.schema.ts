import { createSelectSchema } from "drizzle-zod";
import { z } from "astro:schema";
import { tablePlinkoGameRounds } from "@/db/schema";
import { plinkoSettings } from "./settings.plinko";

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

export const createFullUserSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    password2: z.string(),
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    numberOfGamesPlayed: z.number().int().default(0),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password2"],
        message: "Passwords do not match",
      });
    }
  });

export const createGuestUserSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema,
  password: passwordSchema.optional(),
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  numberOfGamesPlayed: z.number().int().default(0),
});

export const createGuestUser21QuestionsSchema = z.object({
  username: usernameSchema,
  password: passwordSchema.optional(),
  numberOfGamesPlayed: z.number().int().default(0),
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
export const upgradePlinkoGameKeys = [
  "none",
  "addNormalBall",
  "add2NormalBalls",
  "addGoldenBall",
  "pocketValuePlus3000",
  "pocketValuePlus6000",
  "pocketValuePlus9000",
  "multiplyPayoutBy1_5",
  "multiplyPayoutBy2",
  "multiplyPayoutBy3",
] as const;

export const upgradePlinkoGameSchema = z.object({
  // the current round data
  roundData: createSelectSchema(tablePlinkoGameRounds),

  // the upgrade key
  upgradeKey: z.enum(upgradePlinkoGameKeys, {
    message: "Please select an upgrade",
  }),

  // the upgrade values
  none: z.boolean().optional(),
  addNormalBall: z.boolean().optional(),
  add2NormalBalls: z.boolean().optional(),
  addGoldenBall: z.boolean().optional(),
  pocketValuePlus3000: z.enum(plinkoSettings.pocketKeys).optional(),
  pocketValuePlus6000: z.enum(plinkoSettings.pocketKeys).optional(),
  pocketValuePlus9000: z.enum(plinkoSettings.pocketKeys).optional(),
  multiplyPayoutBy1_5: z.boolean().optional(),
  multiplyPayoutBy2: z.boolean().optional(),
  multiplyPayoutBy3: z.boolean().optional(),

  // satisfies: make sure each upgrade has at least one value
} satisfies Record<
  "roundData" | "upgradeKey" | (typeof upgradePlinkoGameKeys)[number],
  any
>);
// minimally, one upgrade must be defined
// these are giving me issues, presumably because I'm using form.setValue() to set the values
// .superRefine((data, ctx) => {
//   let hasUpgrade = false;
//   for (const key of upgradePlinkoGameKeys) {
//     if (data.upgradeKey === key && data[key] !== undefined) {
//       hasUpgrade = true;
//     }
//   }
//   if (!hasUpgrade) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["upgradeKey"],
//       message: "Please select an upgrade",
//     });
//   }
// });
// .refine(
//   (data) => {
//     for (const key of upgradePlinkoGameKeys) {
//       if (data.upgradeKey === key && data[key] !== undefined) {
//         return true;
//       }
//     }
//   },
//   {
//     path: ["upgradeKey"],
//     message: "The upgrade is broken. Please choose another one for now.",
//   },
// );
