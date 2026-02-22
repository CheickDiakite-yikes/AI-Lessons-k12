import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== 'google') return false;
      if (!user.email || !account.providerAccountId) return false;

      try {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.googleId, account.providerAccountId),
        });

        if (!existingUser) {
          await db.insert(users).values({
            googleId: account.providerAccountId,
            email: user.email,
            name: user.name || 'Teacher',
            role: 'teacher',
          });
        } else {
          await db.update(users)
            .set({
              email: user.email,
              name: user.name || existingUser.name,
              updatedAt: new Date(),
            })
            .where(eq(users.googleId, account.providerAccountId));
        }
      } catch (error) {
        console.error('Error syncing user to database:', error);
        return false;
      }

      return true;
    },

    async session({ session, token }) {
      if (token.sub) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.googleId, token.sub),
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.school = dbUser.school || undefined;
          session.user.dbId = dbUser.id;
        }
      }
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});
