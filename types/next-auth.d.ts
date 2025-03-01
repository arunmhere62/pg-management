import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

// ✅ Extend NextAuth types
declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    token?: string; // ✅ Add token to User
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      token?: string; // ✅ Add token to Session
    };
  }
}

// ✅ Extend JWT to store token (but NOT the full User object)
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    token?: string; // ✅ Store only necessary fields in JWT
  }
}
