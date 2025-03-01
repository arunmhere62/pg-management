import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prisma';

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
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }
        const user = await prisma.users.findUnique({
          where: { email: credentials.email as string }
        });
        if (!user) {
          return null;
        }
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          token: `mocked-jwt-token-${user.id}`
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || '';
        token.email = user.email;
        token.name = user.name;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email || '';
      session.user.name = token.name;
      session.user.token = token.token;
      return session;
    }
  },
  pages: {
    signIn: '/' // Sign-in page
  }
} satisfies NextAuthConfig;

export default authConfig;
