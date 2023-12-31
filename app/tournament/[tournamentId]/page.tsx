import ParticipateForm from '@/components/molecules/participate-form';
import Status from '@/components/tournament-status';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import NotLoggedIn from '@/components/organisms/not-loggedin';

interface TournamentPageProps {
  params: {
    tournamentId: string;
  };
}

export async function generateMetadata({ params }: TournamentPageProps) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: params.tournamentId,
    },
    include: {
      createdBy: true,
      participants: true,
    },
  });

  return {
    title: `You are invited to ${tournament?.name ?? ''} tournament by ${tournament?.createdBy.name ?? ''} | Riftmaker`,
  };
}

const Tournament = async ({ params }: TournamentPageProps) => {
  const session = await getServerSession(authOptions);

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
    <main className="flex flex-col gap-8 px-24 items-center my-auto w-full">
      <div className="flex flex-col gap-4 justify-center items-center text-[64px] text-center">
        <h1>
          You were invited to {tournament.createdBy.name}&apos;s tournament <br />
        </h1>
        <div className="flex gap-4 items-center justify-center">
          <b>{tournament.name}</b>
        </div>
        <Status status={tournament.status} className="text-base" />
      </div>
      {!session && <NotLoggedIn />}
      {session && (
        <div className="flex flex-col gap-4 mx-auto">
          <div className="flex flex-col gap-4 mt-8">
            <p>
              Connected as <b>{session.user?.name}</b> ({session.user.elo} {session.user.role})
            </p>
          </div>
          <ParticipateForm tournament={tournament} session={session} />
        </div>
      )}
    </main>
  );
};

export default Tournament;
