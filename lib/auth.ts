import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
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
    // TwitchProvider({
    //   clientId: env.TWITCH_CLIENT_ID,
    //   clientSecret: env.TWITCH_CLIENT_SECRET,
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.preferred_username,
    //       email: profile.email,
    //       image: profile.profile_image_url,
    //       twitchUsername: profile.preferred_username,
    //     };
    //   },
    // }),
  ],

  callbacks: {
    session: async ({ session, user }) => {
      // session.user = {
      //   ...session.user,
      //   discordUsername: user.discordUsername,
      //   twitchUsername: user.twitchUsername,
      // };
      return session;
    },
  },
};
