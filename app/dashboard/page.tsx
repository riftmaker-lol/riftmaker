import CreateTournament from '@/components/molecules/create-tournament';
import TournamentTable from '@/components/organisms/tournament-table';
import { env } from '@/env.mjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/api/auth/signin');
  }

  const tournaments =
    (await prisma?.tournament.findMany({
      include: {
        participants: true,
      },
    })) ?? [];

  const mapTournament = (tournament: (typeof tournaments)[0]) => ({
    // TODO: implement unboxed!
    ...tournament,
    inviteLink: `${env.NEXT_PUBLIC_BASE_URL}/tournament/${tournament.id}`,
    participants: tournament.participants.length,
  });

  return (
    <main className="flex flex-col items-center p-24 w-full">
      <div className="flex flex-col gap-4 my-auto w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row gap-4 justify-between">
            <h3 className="text-3xl font-bold">Active Tournaments:</h3>
            <CreateTournament />
          </div>
          <TournamentTable
            tournaments={tournaments.filter((tournament) => tournament.status !== 'FINISHED').map(mapTournament)}
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-3xl font-bold">Past Tournaments:</h3>
          <TournamentTable
            tournaments={tournaments.filter((tournament) => tournament.status === 'FINISHED').map(mapTournament)}
            actions={{
              view: true,
              end: false,
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
