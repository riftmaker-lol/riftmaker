'use client';

import { DataTable } from '../data-table';
import { columns } from './columns';

interface ParticipantsTableProps {
  data: ParticipantEntry[];
}

export interface ParticipantEntry {
  id: string;
  riotId: string;
  name: string;
  elo: string;
  role: string;
  kicked: boolean;
  tournamentId: string;
}

const ParticipantsTable = ({ data }: ParticipantsTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default ParticipantsTable;
