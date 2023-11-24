'use server';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

interface Response {
  message?: string;
}

export async function participateInTournament(riotId: string, tournamentId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { message: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    // TODO: validate riotId

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        riotId,
      },
    });

    await prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        participants: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return { message: 'Success' };
  } catch (e) {
    return { message: (e as Error).message };
  }
}
