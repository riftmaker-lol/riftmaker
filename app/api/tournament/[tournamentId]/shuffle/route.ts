import { mapPlayer } from '@/lib/draft';
import prisma from '@/lib/prisma';
import { PlayerRole, Team, TeamPlayer, Tournament, User } from '@prisma/client';
import { shuffle } from 'lodash';
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

  const query = request.nextUrl.searchParams;

  const filterByRole = query.get('role') as PlayerRole;
  const filterByElo = query.get('elo') as string;

  console.log({
    filterByRole,
    filterByElo,
  });

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

  const data = mapTournament(tournament, filterByRole, filterByElo);

  return NextResponse.json(data);
}

const mapTournament = (
  tournament: Tournament & {
    participants: User[];
    kickedPlayers: User[];
    teams: Array<
      Team & {
        players: Array<
          TeamPlayer & {
            player: User;
          }
        >;
      }
    >;
  },
  filterByRole?: PlayerRole,
  filterByElo?: string,
) => {
  const playersInTeamsAlready = tournament.teams.flatMap((t) => t.players).map((p) => p.playerId);

  const participants = tournament.participants
    .map((participant) => ({
      ...mapPlayer(participant),
      tournamentId: tournament.id,
      kicked: tournament.kickedPlayers.some((kickedPlayer) => kickedPlayer.id === participant.id),
    }))
    .filter((participant) => !playersInTeamsAlready.includes(participant.id));

  const filterParticipants = participants.filter((participant) => {
    if (filterByRole && !participant.role.toLocaleLowerCase().includes(filterByRole.toLocaleLowerCase())) {
      return false;
    }

    if (filterByElo && participant.elo !== filterByElo) {
      return false;
    }

    return true;
  });

  return {
    ...tournament,
    participants: shuffle(filterParticipants.length < 5 ? participants : filterParticipants), // TODO: document this
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
          mainRole: p.role as PlayerRole,
          role: player.role as PlayerRole,
        };
      }),
    })),
  };
};

export type TournamentData = ReturnType<typeof mapTournament>;
