import { z } from "astro:schema";

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
export const upgradePlinkoGameSchema = z.object({
  addNBalls: z.number(),
  makeLastBallGolden: z.boolean(),
});
