'use client';

import { endTournament } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { TournamentEntry } from '.';
import { DataTableColumnHeader } from '../data-table-column-header';
import Link from 'next/link';

// export interface TournamentEntry {
//   id: string;
//   name: string;
//   participantsCount: number;
//   createdAt: string;
// }

export const columns: ColumnDef<TournamentEntry>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'participantsCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Participants" />,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      return <div> {format(row.original.createdAt, "dd/MM/yyyy' at 'HH:mm")}</div>;
    },
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => {
      const end = async (id: string) => {
        const { message } = await endTournament(id);
        if (message === 'Success') {
          toast({
            title: 'Success',
            description: 'Tournament ended successfully',
          });
        } else {
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          });
        }
      };

      return (
        <div>
          <Link href={`/tournament/${row.original.id}/manage`}>
            <Button variant="outline">View</Button>
          </Link>
          <Button className="ml-2" variant="outline" onClick={() => end(row.original.id)}>
            End
          </Button>
        </div>
      );
    },
  },
];
