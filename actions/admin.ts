"use server";

// IMPORTS -
import { CurrentRole } from "@/lib/current-user";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await CurrentRole();

  if (role === UserRole.ADMIN) {
    return { error: "Allowed!" };
  }

  return { success: "Forbidden!" };
};
