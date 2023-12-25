import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import { deleteStage } from '@/app/tournament/[tournamentId]/actions';
import useAction from '@/hooks/useAction';
import { Round, Stage, Match } from 'brackets-model';
import { TrashIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { MatchWithTeams, StageProvider, useStage } from '../providers/stage-provider';

interface StageProps {
  tournament: TournamentData;
  stageId: string;
}

interface RoundProps {
  round: Round;
  index: number;
}

interface MatchProps {
  match: MatchWithTeams;
  index: number;
}

const Match = ({ match }: MatchProps) => {
  const { tournament } = useStage();
  console.log(match);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card px-8 py-2">{match.opponent1?.team?.name ?? 'TBD'}</div>
      <div className="bg-card px-8 py-2">{match.opponent2?.team?.name ?? 'TBD'}</div>
    </div>
  );
};

const Round = ({ round, index }: RoundProps) => {
  const { roundsByGroup, matches, matchesWithTeams } = useStage();
  const roundMatches = useMemo(
    () => matchesWithTeams?.filter((match) => match.round_id === round.id) ?? [],
    [matchesWithTeams, round.id],
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="py-4 px-8">
        {roundsByGroup?.[round.group_id].length === 1
          ? 'Consolation Final'
          : roundsByGroup?.[round.group_id].length === index + 1
            ? 'Final Round'
            : `Round ${index + 1}`}
      </div>
      <div className="flex flex-col gap-8">
        {roundMatches.map((match, index) => (
          <Match match={match} index={index} key={match.id} />
        ))}
      </div>
    </div>
  );
};

const StageConsumer = () => {
  const { execute, loading } = useAction<typeof deleteStage>(deleteStage, () => {
    toast({
      title: 'Stage deleted',
      description: 'The stage has been deleted.',
    });
  });

  const { stage, roundsByGroup, tournament, groups } = useStage();

  if (!stage || !tournament) return null;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between my-8">
        <h2 className="text-2xl font-bold">Stage: {stage.name}</h2>
        <Button
          variant={'outline'}
          icon={<TrashIcon />}
          loading={loading}
          onClick={() => execute(tournament.id, stage.id as string)}
        >
          Delete
        </Button>
      </div>
      <div className="flex flex-row gap-4">
        {groups.map((group) => (
          <div className="flex flex-row gap-4" key={group.id}>
            {roundsByGroup?.[group.id]?.map((round, index) => <Round round={round} index={index} key={round.id} />)}
          </div>
        ))}
      </div>
    </div>
  );
};

const Stage = ({ tournament, stageId }: StageProps) => {
  return (
    <StageProvider tournament={tournament} stageId={stageId}>
      <StageConsumer />
    </StageProvider>
  );
};

export default Stage;
