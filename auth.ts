// IMPORTS -
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserByID } from "./data/user";
import { UserRole } from "@prisma/client";

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

      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        (session.user as any).role = token.role as UserRole;
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
