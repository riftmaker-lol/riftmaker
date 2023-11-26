'use server';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PlayerRole, TournamentStatus, User } from '@prisma/client';
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

export const createTeam = async (tournamentId: string, random: boolean, teamName: string, elo?: string) => {
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
        id: tournamentId,
      },
      include: {
        participants: true,
      },
    });

    if (!tournament) {
      return { message: 'Not found' };
    }

    // TOODODODODODO
    const potentialPlayers: User[] = [];

    if (random) {
      potentialPlayers.push(...tournament.participants);
    } else {
      potentialPlayers.push(...tournament.participants.filter((p) => p.elo?.includes(elo as string)));
    }

    const { team } = pickPlayers(potentialPlayers);

    // const createdTeam = await prisma.team.create({
    //   data: {
    //     name: teamName,
    //     tournament: {
    //       connect: {
    //         id: tournamentId,
    //       },
    //     },
    //     players: {
    //       connect: Object.entries(team).map(([role, player]) => ({
    //         id: player.id,
    //         role: role as PlayerRole,
    //       })),
    //     },
    //   },
    // });

    return { message: 'Success', data: team };
  } catch (e) {
    return { message: (e as Error).message };
  }
};

const pickPlayers = (players: User[]) => {
  const usedPlayers: User[] = [];
  const team = Object.values(PlayerRole)
    .filter((role) => role !== 'FILL')
    .reduce(
      (acc, role) => {
        const player = players.find((p) => p.role === role);

        if (player) {
          acc[role] = player;
          usedPlayers.push(player);
        }

        return acc;
      },
      {} as Record<PlayerRole, User>,
    );

  if (Object.values(team).length < 5) {
    console.warn('Not enough players to fill a team');
    // Fill with random players
    for (const role of Object.values(PlayerRole).filter((role) => role !== 'FILL')) {
      if (!team[role as PlayerRole]) {
        console.debug('Filling role', role);
        const player = players.find((p) => usedPlayers.indexOf(p) === -1);
        if (player) {
          team[role as PlayerRole] = player;
          usedPlayers.push(player);
        }
      }
    }
  }

  return {
    team,
    usedPlayers,
  };
};
