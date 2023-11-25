'use server';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { TournamentStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const createTournament = async (name: string) => {
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

    if (!user || !user.isAdmin) {
      return { message: 'Not allowed' };
    }

    const createdTournament = await prisma.tournament.create({
      data: {
        name,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return { message: 'Success', id: createdTournament.id };
  } catch (e) {
    return { message: (e as Error).message };
  }
};

export const endTournament = async (id: string) => {
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

    if (!user || !user.isAdmin) {
      return { message: 'Not allowed' };
    }

    const tournament = await prisma.tournament.findUnique({
      where: {
        id,
      },
    });

    if (!tournament) {
      return { message: 'Not found' };
    }

    const updatedTournament = await prisma.tournament.update({
      where: {
        id,
      },
      data: {
        status: TournamentStatus.FINISHED,
      },
    });

    revalidatePath(`/dashboard`);

    return { message: 'Success', id: updatedTournament.id };
  } catch (e) {
    return { message: (e as Error).message };
  }
};
