'use client';

import { Tournament, TournamentStatus } from '@prisma/client';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import InviteLink from '../molecules/invite-link';
import ParticipantsTable from '../molecules/participants-table';
import TournamentControls from '../molecules/tournament-controls';
import Loading from '../ui/loading';
import CreateTeam from '../molecules/create-team';
import PickRandom from '../molecules/pick-random';

const queryClient = new QueryClient();

interface Participant {
  id: string;
  riotId: string;
  name: string;
  role: string;
  rank: string;
  tournamentId: string;
  kicked: boolean;
}

const TournamentDashboardConsumer = ({ tournamentId }: { tournamentId: string }) => {
  const { isLoading, error, data } = useQuery(
    'tounament',
    () => fetch(`/api/tournament/${tournamentId}`).then((res) => res.json()),
    {
      refetchInterval: 3000,
    },
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loading className="w-4 h-4" /> <span>Loading ...</span>
      </div>
    );

  if (error) return 'An error has occurred: ' + (error as Error).message;

  const tournament = data as Tournament & {
    participants: Participant[];
    kickedPlayers: Participant[];
  };

  return (
    <>
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
          <div className="flex flex-row gap-4 justify-between">
            <h3 className="text-3xl font-semibold">Participants:</h3>
            <div className="space-x-2">
              <CreateTeam tournament={tournament} />
              <PickRandom tournament={tournament} />
            </div>
          </div>

          <ParticipantsTable data={tournament.participants} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold">Blacklist Players:</h3>
          <ParticipantsTable data={tournament.kickedPlayers} />
        </div>
      </div>
    </>
  );
};

const TournamentDashboard = ({ tournamentId }: { tournamentId: string }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TournamentDashboardConsumer tournamentId={tournamentId} />
    </QueryClientProvider>
  );
};

export default TournamentDashboard;
