'use client';

import { TournamentStatus } from '@prisma/client';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import CreateTeam from '../molecules/create-team';
import InviteLink from '../molecules/invite-link';
import ParticipantsTable from '../molecules/participants-table';
import PickRandom from '../molecules/pick-random';
import TeamsTable from '../molecules/teams-table';
import TournamentControls from '../molecules/tournament-controls';
import Roulette from '../molecules/roulette';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const TournamentDashboardConsumer = ({ tournamentId }: { tournamentId: string }) => {
  const { error, data } = useQuery(
    'tounament',
    () => fetch(`/api/tournament/${tournamentId}`).then((res) => res.json()),
    {
      // refetchInterval: 10_000,
    },
  );

  if (error) return 'An error has occurred: ' + (error as Error).message;

  const tournament = data as TournamentData;

  return (
    <>
      <div className="flex flex-row justify-between gap-4 font-sans flex-grow">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{tournament.name}</h1>
          <p>
            #{tournamentId} <span className="text-sm text-gray-500">({tournament.status})</span>
          </p>
        </div>
        {tournament.status !== TournamentStatus.FINISHED && <TournamentControls tournament={tournament} />}
      </div>

      <div className="space-y-8">
        {([TournamentStatus.CREATED, TournamentStatus.ACCEPTING_PARTICIPANTS] as TournamentStatus[]).includes(
          tournament.status,
        ) && <InviteLink tournament={tournament} />}
        <div className="space-y-16">
          {!([TournamentStatus.CREATED, TournamentStatus.ACCEPTING_PARTICIPANTS] as TournamentStatus[]).includes(
            tournament.status,
          ) && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 justify-between items-center">
                <h3 className="text-3xl font-semibold">Teams:</h3>
                <div className="space-x-2">
                  {tournament.status === TournamentStatus.READY && (
                    <>
                      <CreateTeam tournament={tournament} />
                      <PickRandom tournamentId={tournamentId} />
                    </>
                  )}
                </div>
              </div>

              <TeamsTable data={tournament.teams} />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="text-3xl font-semibold">Participants:</h3>

            <ParticipantsTable data={tournament.participants} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-3xl font-semibold">Blacklist Players:</h3>
            <ParticipantsTable data={tournament.kickedPlayers} />
          </div>
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
