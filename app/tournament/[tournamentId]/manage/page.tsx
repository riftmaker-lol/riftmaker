import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { env } from '@/env.mjs';
import { Button } from '@/components/ui/button';
import ParticipantsTable, { ParticipantEntry } from '@/components/molecules/participants-table';
import prisma from '@/lib/prisma';
import { TournamentStatus, User } from '@prisma/client';
import { updateTournamentStatus } from '../actions';
import { endTournament } from '@/app/dashboard/actions';
import TournamentControls from '@/components/molecules/tournament-controls';
import { FiChevronLeft } from 'react-icons/fi';
import { redirect } from 'next/navigation';
import BackButton from '@/components/molecules/back-button';
import InviteLink from '@/components/molecules/invite-link';

const ManageTournament = async ({
  params,
}: {
  params: {
    tournamentId: string;
  };
}) => {
  const { tournamentId } = params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return <div>Not authorized</div>;
  }

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    include: {
      participants: true,
      kickedPlayers: true,
    },
  });

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  const mapParticipantToEntry = (participant: User, kicked = false) => {
    return {
      id: participant.id,
      riotId: participant.riotId ?? '???',
      name: participant.name ?? 'Hassan',
      role: participant.role ?? 'N/A',
      rank: participant.elo ?? 'Zrag',
      kicked,
      tournamentId,
    } as ParticipantEntry;
  };

  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <BackButton />
      <div className="flex flex-row justify-between gap-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{tournament.name}</h1>
          <p>
            #{tournamentId} <span className="text-sm text-gray-500">({tournament.status})</span>
          </p>
        </div>
        {tournament.status !== TournamentStatus.FINISHED && <TournamentControls tournament={tournament} />}
      </div>
      <div className="space-y-8">
        <InviteLink tournament={tournament} />
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold">Participants:</h3>
          <ParticipantsTable data={tournament.participants.map((participant) => mapParticipantToEntry(participant))} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold">Kicked Players:</h3>
          <ParticipantsTable
            data={tournament.kickedPlayers.map((participant) => mapParticipantToEntry(participant, true))}
          />
        </div>
      </div>
    </main>
  );
};

export default ManageTournament;
