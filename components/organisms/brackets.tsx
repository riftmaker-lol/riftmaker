'use client';

import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import { Button } from '../ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { deleteStage } from '@/app/tournament/[tournamentId]/actions';
import useAction from '@/hooks/useAction';
import { toast } from '../ui/use-toast';
import Stage from '../molecules/stage';

interface BracketsProps {
  tournament: TournamentData;
}

const Brackets = ({ tournament }: BracketsProps) => {
  const stages = tournament.brackets.stage.flatMap((stage) => stage);

  return (
    <div className="flex flex-col flex-grow gap-8">
      {stages.map((stage) => (
        <Stage key={stage.id} tournament={tournament} stageId={stage.id as string} />
      ))}
    </div>
  );
};

export default Brackets;
