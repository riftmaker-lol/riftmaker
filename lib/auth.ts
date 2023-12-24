import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PlayerRole, User } from '@prisma/client';
import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.user = {
        ...session.user,
        isAdmin: (user as User).isAdmin,
        elo: (user as User).elo ?? 'Zrag',
        role: (user as User).role ?? PlayerRole.FILL,
        riotId: (user as User).riotId ?? '',
      };
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      else if (url.startsWith('riftmaker://')) return url;
      return baseUrl;
    },
  },
};
