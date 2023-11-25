import { PlayerRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      isAdmin: boolean;
      elo: string;
      role: PlayerRole;
      riotId: string;
    } & DefaultSession['user'];
  }
}
