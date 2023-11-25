import prisma from '@/lib/prisma';
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
      createdBy: true,
      participants: true,
      kickedPlayers: true,
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

  const data = {
    ...tournament,
    participants: tournament.participants.map((participant) => ({
      id: participant.id,
      riotId: participant.riotId ?? '???',
      name: participant.name ?? 'Hassan',
      role: participant.role ?? 'N/A',
      rank: participant.elo === 'UNRANKED 0' ? 'Zrag' : participant.elo ?? 'Zrag',
      tournamentId,
      kicked: tournament.kickedPlayers.some((kickedPlayer) => kickedPlayer.id === participant.id),
    })),
  };

  return NextResponse.json(data);
}
