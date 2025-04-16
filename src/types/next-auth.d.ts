import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    roleId: string;
    roleName: string;
    token?: string;
    pgLocationId: string | null;
    organizationId: string;
  }

  interface Session {
    user: User;
    roleId: string;
    roleName: string;
    pgLocationId: string | null;
    organizationId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    token?: string;
    roleId: string;
    roleName: string;
    pgLocationId: string | null;
    organizationId: string;
  }
}
