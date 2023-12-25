import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import { Unboxed } from '@/types/util';
import { Round, Stage, Match, Group } from 'brackets-model';
import { createContext, useContext, useMemo } from 'react';

type TournamentTeam = Unboxed<TournamentData['teams']>;

export type MatchWithTeams = Match & {
  opponent1: Match['opponent1'] & { team: TournamentTeam | null };
  opponent2: Match['opponent2'] & { team: TournamentTeam | null };
};

export interface StageState {
  stage?: Stage;
  roundsByGroup?: Record<string, Round[]>;
  tournament?: TournamentData;
  matches: Match[];
  matchesWithTeams?: MatchWithTeams[];
  groups: Group[];
}

const StageState: StageState = {
  roundsByGroup: {},
  matches: [],
  groups: [],
};

export const StageContext = createContext<StageState>(StageState);

export const StageProvider = ({
  children,
  tournament,
  stageId,
}: {
  children: React.ReactNode;
  tournament: TournamentData;
  stageId: string;
}) => {
  const stage = useMemo(() => tournament.brackets.stage?.find((stage) => stage.id === stageId), [tournament, stageId]);
  const roundsByGroup = useMemo(
    () =>
      tournament.brackets.round.reduce(
        (acc, round) => {
          if (!acc[round.group_id]) acc[round.group_id] = [];
          acc[round.group_id].push(round);
          return acc;
        },
        {} as Record<string, Round[]>,
      ),
    [tournament.brackets?.round],
  );

  const matches = useMemo(
    () => tournament.brackets.match.filter((match) => match.stage_id === stageId),
    [stageId, tournament.brackets?.match],
  );

  const groups = useMemo(
    () => tournament.brackets.group.filter((group) => group.stage_id === stageId),
    [stageId, tournament.brackets?.group],
  );

  const teamById = useMemo(
    () =>
      tournament.teams.reduce(
        (acc, team) => {
          acc[team.id] = team;
          return acc;
        },
        {} as Record<string, TournamentTeam>,
      ),
    [tournament.teams],
  );

  const participantToTeam = useMemo(
    () =>
      tournament.brackets.participant.reduce(
        (acc, participant) => {
          acc[participant.id] = teamById?.[participant.name] ?? null;
          return acc;
        },
        {} as Record<string, TournamentTeam>,
      ),
    [teamById, tournament.brackets.participant],
  );

  const matchesWithTeams = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        opponent1: {
          ...match.opponent1,
          id: match.opponent1?.id ?? null,
          team: match.opponent1?.id ? (participantToTeam[match.opponent1?.id] as TournamentTeam) : null,
        },
        opponent2: {
          ...match.opponent2,
          id: match.opponent2?.id ?? null,
          team: match.opponent2?.id ? (participantToTeam[match.opponent2?.id] as TournamentTeam) : null,
        },
      })),
    [matches, participantToTeam],
  );

  return (
    <StageContext.Provider
      value={{
        stage,
        roundsByGroup,
        tournament,
        matches,
        matchesWithTeams,
        groups,
      }}
    >
      {children}
    </StageContext.Provider>
  );
};

export const useStage = () => {
  const context = useContext(StageContext);
  if (context === undefined) throw new Error('useStage must be used within a StageProvider');
  return context;
};
