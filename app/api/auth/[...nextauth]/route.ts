import { authOptions } from '@/lib/auth';
import NextAuth, { DefaultSession } from 'next-auth';

declare module '@auth/core' {
  interface Session {
    user: {
      discordUsername: string;
    } & DefaultSession['user'];
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
