// IMPORTS -
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

// FIXING TYPES FOLLOWING WHAT IS IN THE DOC -
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface session {
    user: ExtendedUser;
  }
}
