'use client';

import { DataTable } from '../data-table';
import { columns } from './columns';

interface TournamentsTableProps {
  data: TournamentEntry[];
}

export interface TournamentEntry {
  id: string;
  name: string;
  participantsCount: number;
  createdAt: Date;
}

const TournamentsTable = ({ data }: TournamentsTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default TournamentsTable;
