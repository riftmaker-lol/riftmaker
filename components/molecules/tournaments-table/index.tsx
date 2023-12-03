'use client';

import { TournamentStatus, User } from '@prisma/client';
import { DataTable } from '../data-table';
import { columns } from './columns';
import { useRouter } from 'next/navigation';

interface TournamentsTableProps {
  data: TournamentEntry[];
}

export interface TournamentEntry {
  id: string;
  name: string;
  participantsCount: number;
  createdAt: Date;
  status: TournamentStatus;
  createdBy: User;
}

const TournamentsTable = ({ data }: TournamentsTableProps) => {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => router.push(`/tournament/${row.original.id}/manage`)}
    />
  );
};

export default TournamentsTable;
