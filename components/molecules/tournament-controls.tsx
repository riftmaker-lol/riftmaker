'use client';

import { endTournament } from '@/app/dashboard/actions';
import { updateTournamentStatus } from '@/app/tournament/[tournamentId]/actions';
import { Tournament, TournamentStatus } from '@prisma/client';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface TournamentControlsProps {
  tournament: Tournament;
}

const TournamentControls = ({ tournament }: TournamentControlsProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const updateStatus = async (status: TournamentStatus) => {
    const { message } = await updateTournamentStatus(tournament.id, status);
    if (message === 'Success') {
      toast({
        title: 'Tournament status updated',
        description: `Tournament status updated to ${status}`,
      });
    } else {
      toast({
        title: 'Tournament status update failed',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const end = async () => {
    const { message } = await endTournament(tournament.id);
    if (message === 'Success') {
      toast({
        title: 'Success',
        description: 'Tournament ended successfully',
      });

      router.push('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-row gap-4">
      {tournament.status === TournamentStatus.CREATED && (
        <Button onClick={() => updateStatus(TournamentStatus.ACCEPTING_PARTICIPANTS)}>Start Tournament</Button>
      )}
      {tournament.status === TournamentStatus.ACCEPTING_PARTICIPANTS && (
        <Button variant={'outline'} onClick={() => updateStatus(TournamentStatus.READY)}>
          Stop registrations
        </Button>
      )}
      <Button variant="destructive" onClick={() => end()}>
        End Tournament
      </Button>
    </div>
  );
};

export default TournamentControls;
