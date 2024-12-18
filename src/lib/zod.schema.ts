import { z } from "astro:schema";

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
