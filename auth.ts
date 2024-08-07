// IMPORTS -
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserByID } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // EMAIL VERIFICATION -
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserByID(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        (session.user as any).role = token.role as UserRole;
      }

      if (session.user) {
        (session.user as any).isTwoFactorEnabled =
          token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = String(token.email);
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserByID(String(user?.id));

      // PREVENT SIGN IN WITHOUT EMAIL VERIFICATON -
      if (!existingUser?.emailVerified) return false;

      // TODO: ADD 2FA CHECK -

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorFlag = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorFlag) return false;

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorFlag.id,
          },
        });
      }

      return true;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});

// npx prisma migrate reset - reset database
// npx prisma db push - run this everytime you reset db
// npx prisma generate - generate prisma client
// npx prisma studio - open prisma studio
