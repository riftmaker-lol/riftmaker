import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BackButton from '@/components/molecules/back-button';
import TournamentDashboard from '@/components/organisms/tournament-dashboard';
import { Suspense } from 'react';
import Roulette from '@/components/molecules/roulette';

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

  return (
    <main className="flex flex-col gap-8 px-24 w-full flex-grow">
      <BackButton />
      <Suspense>
        <TournamentDashboard tournamentId={tournamentId} />
      </Suspense>
    </main>
  );
};

export default ManageTournament;
