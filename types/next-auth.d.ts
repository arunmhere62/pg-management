import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

// ✅ Extend NextAuth types
declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    token: string;
    roleId: string;
    roleName: string;
    pgLocationId: string | null;
    organizationId: string;
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      email: string;
    };
    roleId: string;
    roleName: string;
    pgLocationId: string | null;
    organizationId: string;
  }
}

// ✅ Extend JWT to store token (but NOT the full User object)
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name: string;
    token: string;
    roleId: string;
    roleName: string;
    pgLocationId: string | null;
    organizationId: string;
  }
}
