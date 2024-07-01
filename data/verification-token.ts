// IMPORTS -
import { db } from "@/lib/db";

// GET VERIFICATION TOKEN BY EMAIL -
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

// GET VERIFICATION TOKEN BY TOKEN -
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
