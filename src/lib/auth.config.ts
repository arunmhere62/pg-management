import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prisma';
import type { User } from 'next-auth';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials.email || !credentials.password) {
          return null;
        }
        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email as string
          },
          select: {
            roleId: true,
            id: true,
            name: true,
            email: true,
            pgLocationId: true,
            phone: true,
            roles: {
              select: {
                roleName: true
              }
            }
          }
        });
        if (!user || user.roleId === undefined || user.roleId === null) {
          throw new Error(
            'User roleId is missing. Ensure it is set in the database.'
          );
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          roleId: user.roleId.toString(),
          roleName: user.roles?.roleName,
          token: `mocked-jwt-token-${user.id}`
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
        token.token = user.token;
        token.roleId = user.roleId as string;
        token.roleName = user.roleName;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.roleId = token.roleId as string;
      session.roleName = token?.roleName as string;
      return session;
    }
  },
  trustHost: true,
  pages: {
    signIn: '/' // Sign-in page
  }
} satisfies NextAuthConfig;

export default authConfig;
