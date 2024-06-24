// IMPORTS -
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserByID } from "./data/user";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserByID(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      console.log({
        sessionToken: token,
      });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        (session.user as any).role = token.role as UserRole;
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});

// npx prisma migrate reset - reset database
// npx prisma db push - run this everytime you reset db
// npx prisma generate - generate prisma client
// npx prisma studio - open prisma studio
