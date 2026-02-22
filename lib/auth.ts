import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!dbUser || !dbUser.passwordHash) return null;

        const isValid = await bcrypt.compare(password, dbUser.passwordHash);
        if (!isValid) return null;

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email || !account.providerAccountId) return false;
        const emailLower = user.email.toLowerCase();

        try {
          const existingUser = await db.query.users.findFirst({
            where: eq(users.googleId, account.providerAccountId),
          });

          if (!existingUser) {
            const existingEmailUser = await db.query.users.findFirst({
              where: eq(users.email, emailLower),
            });

            if (existingEmailUser) {
              await db.update(users)
                .set({
                  googleId: account.providerAccountId,
                  name: user.name || existingEmailUser.name,
                  updatedAt: new Date(),
                })
                .where(eq(users.email, emailLower));
            } else {
              await db.insert(users).values({
                googleId: account.providerAccountId,
                email: emailLower,
                name: user.name || 'Teacher',
                role: 'teacher',
              });
            }
          } else {
            await db.update(users)
              .set({
                email: emailLower,
                name: user.name || existingUser.name,
                updatedAt: new Date(),
              })
              .where(eq(users.googleId, account.providerAccountId));
          }
        } catch (error) {
          console.error('Error syncing user to database:', error);
          return false;
        }
      }

      return true;
    },

    async session({ session, token }) {
      if (token.dbId) {
        session.user.id = token.dbId as string;
        session.user.dbId = token.dbId as string;
        session.user.role = token.role as string;
        session.user.school = token.school as string | undefined;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.googleId, account.providerAccountId),
        });
        if (dbUser) {
          token.dbId = dbUser.id;
          token.role = dbUser.role;
          token.school = dbUser.school;
        }
      } else if (account?.provider === 'credentials' && user?.id) {
        token.dbId = user.id;
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.school = dbUser.school;
        }
      }

      if (!token.dbId && token.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, (token.email as string).toLowerCase()),
        });
        if (dbUser) {
          token.dbId = dbUser.id;
          token.role = dbUser.role;
          token.school = dbUser.school;
        }
      }

      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});
