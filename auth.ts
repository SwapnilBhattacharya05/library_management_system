import NextAuth, { User } from "next-auth";

// ONLY THIS PROVIDER IS NEEDED FOR THIS PROJECT
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // MANAGE THE SESSION OF THE USER
  session: {
    // jwt => JSON WEB TOKEN
    strategy: "jwt",
  },
  // CredentialsProvider => PROVIDE THE USER CREDENTIALS
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null; // !MEANING NOTHING IS THERE
        }

        // eq => EQUAL
        const user = await db
          .select()
          .from(users)
          // ? IF THE EMAIL FIELD MATCHES THE CREDENTIALS THEN RETURN THE USER
          .where(eq(users.email, credentials.email.toString()))
          // CAN ONLY BE ONE USER WITH THE SAME EMAIL
          .limit(1);

        // IF THERE IS NO USER RETURN NULL
        if (user.length === 0) return null;

        // ?COMPARE THE PASSWORD WITH THE ONE IN THE DATABASE
        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password
        );

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,

          // FOLLOW THE NEXT AUTH RULES, USER STRUCTURE
        } as User;
      },
    }),
  ],
  // DEFINE PAGE WHERE THE AUTH WILL BE DONE
  pages: {
    signIn: "/sign-in",
  },
  // callbacks => WHEN THE USER LOGS IN
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      // RETURN THE MODIFIED TOKEN
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // as string FOR TYPESCRIPT TO BE SAFE
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },

    /*
     * POPULATE THE TOKEN AS WELL AS THE SESSION WITH THE CURRENTLY LOGGED IN USER
     */
  },
});
