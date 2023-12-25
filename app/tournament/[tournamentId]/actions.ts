'use server';

import { authOptions } from '@/lib/auth';
import manager from '@/lib/bracket';
import prisma from '@/lib/prisma';
import { validateRiotId } from '@/lib/riot';
import { TournamentStatus } from '@prisma/client';
import { StageType } from 'brackets-model';
import { ca } from 'date-fns/locale';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

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
      include: {
        kickedPlayers: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.kickedPlayers.some((player) => player.id === user.id)) {
      return { message: "You have been kicked from this tournament. You can't participate." };
    }

    if (tounament.status !== 'ACCEPTING_PARTICIPANTS') {
      switch (tounament.status) {
        case 'READY':
          return { message: 'Tournament is no longer accepting participants, better luck next time!' };
        case 'CREATED':
          return { message: 'Tournament is not accepting participants yet. Please wait.' };
        default:
          return { message: 'Tournament has ended.' };
      }
    }

    const { riotId: verifiedRiotId, elo, role } = await validateRiotId(riotId);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        riotId: verifiedRiotId,
        elo,
        role,
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

    revalidatePath(`/tournament/[tournamentId]`, 'page');
    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');

    return { message: 'Success' };
  } catch (e) {
    return { message: (e as Error).message };
  }
}

export async function updateTournamentStatus(tournamentId: string, status: TournamentStatus) {
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
      return { message: 'User not found or not an admin' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        createdBy: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.createdBy.id !== user.id) {
      return { message: 'You are not the creator of this tournament' };
    }

    await prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        status,
      },
    });

    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');

    return { message: 'Success' };
  } catch (e) {
    return { message: (e as Error).message };
  }
}

export async function blacklistPlayerFromTournament(tournamentId: string, playerId: string) {
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
      return { message: 'User not found or not an admin' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        createdBy: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.createdBy.id !== user.id) {
      return { message: 'You are not the creator of this tournament' };
    }

    await prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        kickedPlayers: {
          connect: {
            id: playerId,
          },
        },
        participants: {
          disconnect: {
            id: playerId,
          },
        },
      },
    });

    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');

    return { message: 'Success' };
  } catch (e) {
    console.error(e);
    return { message: (e as Error).message };
  }
}

export async function allowPlayerInTournament(tournamentId: string, playerId: string) {
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
      return { message: 'User not found or not an admin' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        createdBy: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.createdBy.id !== user.id) {
      return { message: 'You are not the creator of this tournament' };
    }

    await prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        kickedPlayers: {
          disconnect: {
            id: playerId,
          },
        },
        participants: {
          connect: {
            id: playerId,
          },
        },
      },
    });

    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');

    return { message: 'Success' };
  } catch (e) {
    console.error(e);
    return { message: (e as Error).message };
  }
}

export async function removePlayerFromTournament(tournamentId: string, playerId: string) {
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
      return { message: 'User not found or not an admin' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        createdBy: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.createdBy.id !== user.id) {
      return { message: 'You are not the creator of this tournament' };
    }

    await prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        participants: {
          disconnect: {
            id: playerId,
          },
        },
      },
    });

    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');

    return { message: 'Success' };
  } catch (e) {
    console.error(e);
    return { message: (e as Error).message };
  }
}

export async function banPlayer(playerId: string) {
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
      return { message: 'User not found or not an admin' };
    }

    await prisma.user.update({
      where: {
        id: playerId,
      },
      data: {
        isBanned: true,
      },
    });

    return { message: 'Success' };
  } catch (e) {
    console.error(e);
    return { message: (e as Error).message };
  }
}

export const removeTeamFromTournament = async (tournamentId: string, teamId: string) => {
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
      return { message: 'User not found or not an admin' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        createdBy: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.createdBy.id !== user.id) {
      return { message: 'You are not the creator of this tournament' };
    }

    await prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        teams: {
          disconnect: {
            id: teamId,
          },
        },
      },
    });

    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');

    return { message: 'Success' };
  } catch (e) {
    console.error(e);
    return { message: (e as Error).message };
  }
};

export const createBracket = async (
  tournamentId: string,
  bracketName: string,
  bracketType: StageType,
  teamsIds: string[],
) => {
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
      return { message: 'User not found or not an admin' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        createdBy: true,
        teams: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.createdBy.id !== user.id) {
      return { message: 'You are not the creator of this tournament' };
    }

    const stage = await manager.create.stage({
      name: bracketName,
      tournamentId,
      type: bracketType,
      seeding: tounament.teams
        .filter((team) => teamsIds.includes(team.id as string))
        .map((team) => ({
          id: team.id as string,
          name: team.id,
          tournament_id: tournamentId,
        })),
      settings: {
        consolationFinal: teamsIds.length >= 4, // THIS WAS THE BUG lol
        size: teamsIds.length,
      },
    });

    await prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        stages: {
          connect: {
            id: stage.id as string,
          },
        },
      },
    });

    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');
    return { message: 'Success' };
  } catch (e) {
    console.error(e);
    return { message: (e as Error).message };
  }
};

export const deleteStage = async (tournamentId: string, stageId: string) => {
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
      return { message: 'User not found or not an admin' };
    }

    const tounament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        createdBy: true,
        teams: true,
      },
    });

    if (!tounament) {
      return { message: 'Tournament not found' };
    }

    if (tounament.createdBy.id !== user.id) {
      return { message: 'You are not the creator of this tournament' };
    }

    await manager.delete.stage(stageId);

    revalidatePath(`/tournament/[tournamentId]/manage`, 'page');
    return { message: 'Success' };
  } catch (e) {
    console.error(e);
    return { message: (e as Error).message };
  }
};
