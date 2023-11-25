import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BackButton from '@/components/molecules/back-button';
import TournamentDashboard from '@/components/organisms/tournament-dashboard';

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
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <BackButton />
      <TournamentDashboard tournamentId={tournamentId} />
    </main>
  );
};

export default ManageTournament;
