import NotLoggedIn from '../../../components/organisms/not-loggedin';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ParticipateForm from '@/components/molecules/participate-form';

const Tournament = async ({
  params,
}: {
  params: {
    tournamentId: string;
  };
}) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NotLoggedIn />;
  }

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: params.tournamentId,
    },
    include: {
      createdBy: true,
      participants: true,
    },
  });

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <div className="flex flex-row justify-between gap-4">
        <div className="space-y-4">
          <h1 className="text-4xl">
            Tournament: <b>{tournament.name}</b> by <i>{tournament.createdBy.name}</i>
          </h1>
          <p>
            #{tournament.id} <span className="text-sm text-gray-500">({tournament.status})</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-4 mt-24">
          <p>
            Connected as <b>{session.user?.name}</b> ({session.user.elo} {session.user.role})
          </p>
        </div>
        <ParticipateForm tournament={tournament} session={session} />
      </div>
    </main>
  );
};

export default Tournament;
