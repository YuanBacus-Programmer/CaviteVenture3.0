// src/types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'user' | 'admin' | 'superadmin';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'user' | 'admin' | 'superadmin';
  }
}
