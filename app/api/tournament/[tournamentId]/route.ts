import { mapPlayer } from '@/lib/draft';
import prisma from '@/lib/prisma';
import { Team, Tournament, User } from '@prisma/client';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      tournamentId: string;
    };
  },
) {
  const { tournamentId } = params;

  if (!tournamentId) {
    return NextResponse.json(
      {
        message: 'Missing tournamentId',
      },
      {
        status: 400,
      },
    );
  }

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    include: {
      participants: true,
      kickedPlayers: true,
      teams: {
        include: {
          players: {
            include: {
              player: true,
            },
          },
        },
      },
    },
  });

  if (!tournament) {
    return NextResponse.json(
      {
        message: 'Tournament not found',
      },
      {
        status: 404,
      },
    );
  }

  const data = mapTournament(tournament);

  return NextResponse.json(data);
}

const mapTournament = (
  tournament: Tournament & {
    participants: User[];
    kickedPlayers: User[];
    teams: Array<
      Team & {
        players: Array<{
          role: string;
          player: User;
        }>;
      }
    >;
  },
) => ({
  ...tournament,
  participants: tournament.participants.map((participant) => ({
    ...mapPlayer(participant),
    tournamentId: tournament.id,
    kicked: tournament.kickedPlayers.some((kickedPlayer) => kickedPlayer.id === participant.id),
  })),
  kickedPlayers: tournament.kickedPlayers.map((participant) => ({
    ...mapPlayer(participant),
    tournamentId: tournament.id,
    kicked: true,
  })),
  teams: tournament.teams.map((team) => ({
    id: team.id,
    name: team.name,
    tournamentId: tournament.id,
    players: team.players.map((player) => {
      const p = mapPlayer(player.player);
      return {
        ...p,
        mainRole: p.role,
        role: player.role,
      };
    }),
  })),
});

export type TournamentData = ReturnType<typeof mapTournament>;
