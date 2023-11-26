'use client';

import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import { DataTable } from '../data-table';
import { columns } from './columns';

interface TeamsTableProps {
  data: TeamEntry[];
}

export type TeamEntry = TournamentData['teams'][0];

const TeamsTable = ({ data }: TeamsTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default TeamsTable;
