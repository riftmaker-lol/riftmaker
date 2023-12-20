import CreateTournament from '@/components/molecules/create-tournament';
import TournamentsTable from '@/components/molecules/tournaments-table';
import { env } from '@/env.mjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sortByStatus } from '@/lib/table';
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
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })) ?? [];

  const mapTournament = (tournament: (typeof tournaments)[0]) => ({
    ...tournament,
    inviteLink: `${env.NEXT_PUBLIC_BASE_URL}/tournament/${tournament.id}`,
    participantsCount: tournament.participants.length,
  });

  return (
    <main className="flex flex-col items-center p-24 w-full">
      <div className="flex flex-col gap-4 my-auto w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row gap-4 justify-between">
            <h3 className="text-3xl font-bold">Tournaments:</h3>
            <CreateTournament />
          </div>
          <TournamentsTable data={tournaments.map(mapTournament).sort(sortByStatus)} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
