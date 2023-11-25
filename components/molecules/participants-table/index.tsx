import prisma from '@/lib/prisma';
import { DataTable } from '../data-table';
import { columns } from './columns';
import { Tournament, User } from '@prisma/client';

interface ParticipantsTableProps {
  data: ParticipantEntry[];
}

export interface ParticipantEntry {
  id: string;
  riotId: string;
  name: string;
  rank: string;
  role: string;
  kicked: boolean;
  tournamentId: string;
}

const ParticipantsTable = async ({ data }: ParticipantsTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default ParticipantsTable;
