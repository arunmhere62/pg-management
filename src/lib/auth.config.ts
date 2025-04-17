import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import type { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { APP_CONFIG } from '@/constants/data';

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            encodeURIComponent(
              JSON.stringify({
                code: 400,
                message: 'Email and password are required.'
              })
            )
          );
        }
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error(
            JSON.stringify({
              code: 400,
              message: 'Email and password are required.'
            })
          );
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email as string,
            isDeleted: false
          },
          select: {
            roleId: true,
            id: true,
            name: true,
            email: true,
            phone: true,
            pgId: true,
            password: true,
            organizationId: true,
            roles: {
              select: {
                roleName: true
              }
            }
          }
        });
        console.log('user data', user);
        if (!user) {
          return Promise.reject(new Error('Email not found'));
        }

        if (credentials.password !== user.password) {
          return Promise.reject(new Error('Incorrect password'));
        }

        console.log('user data', user);

        const isValidPassword = password === user.password;

        if (!isValidPassword) {
          throw new Error(
            JSON.stringify({ code: 401, message: 'Incorrect password.' })
          );
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          roleId: user.roleId.toString(),
          roleName: user.roles?.roleName,
          token: `mocked-jwt-token-${user.id}`,
          pgLocationId: user.pgId?.toString() ?? null,
          organizationId: user.organizationId?.toString() ?? null
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: APP_CONFIG.SESSION_EXPIRY_SECONDS
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        const expirySeconds = APP_CONFIG.SESSION_EXPIRY_SECONDS;
        const expiryTimestamp = Date.now() + expirySeconds * 1000;
        token.id = user.id?.toString() ?? '';
        token.email = user.email?.toString() ?? '';
        token.name = user.name?.toString() ?? '';
        token.token = user.token;
        token.roleId = user.roleId;
        token.roleName = user.roleName;
        token.pgLocationId = user.pgLocationId ?? null;
        token.organizationId = user.organizationId ?? null;
        token.expirySeconds = expirySeconds;
        token.expiryTimestamp = expiryTimestamp; // ✅ new
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.roleId = token.roleId as string;
      session.roleName = token.roleName as string;
      session.pgLocationId = token.pgLocationId as string | null;
      session.organizationId = token.organizationId as string;
      session.expirySeconds = token.expirySeconds as number;
      session.expiryTimestamp = token.expiryTimestamp as number; // ✅ new
      return session;
    }
  },
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default authConfig;
