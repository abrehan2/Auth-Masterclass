"use server";

// IMPORTS -
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationForResetPassword } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "User not found" };
  }

  // TODO: GENERATE TOKEN AND SEND EMAIL
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendVerificationForResetPassword(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { success: "Check your email for a password reset link" };
};
