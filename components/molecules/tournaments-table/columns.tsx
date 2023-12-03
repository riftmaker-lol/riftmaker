'use client';

import { endTournament } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { TournamentEntry } from '.';
import { DataTableColumnHeader } from '../data-table-column-header';
import Link from 'next/link';
import Status from '@/components/tournament-status';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoEllipsisVertical } from 'react-icons/io5';
import { LuEye, LuPencilRuler, LuTrash, LuTrophy } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { TournamentStatus } from '@prisma/client';
import { sortByStatus } from '@/lib/table';

export const columns: ColumnDef<TournamentEntry>[] = [
  {
    accessorKey: 'icon',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => {
      return (
        <div
          className={cn('flex gap-2 items-center p-2 border-2 w-fit', {
            'border-acccent bg-accent': row.original.status === TournamentStatus.READY,
          })}
        >
          <LuTrophy className="w-4 h-4" />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <Link href={`/tournament/${row.original.id}/manage`} className="uppercase">
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'createdBy.name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Organized By" />,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <LuPencilRuler className="w-4 h-4" />
          By {row.original.createdBy.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'participantsCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Participants" />,
    cell: ({ row }) => {
      return <div>{row.original.participantsCount} participant</div>;
    },
  },
  {
    accessorKey: 'status',
    enableSorting: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return <Status status={row.original.status} className="w-fit" size="sm" />;
    },
    sortingFn: (rowA, rowB) => {
      console.log(rowA, rowB);
      return sortByStatus(rowA.original, rowB.original);
    },
  },
  // {
  //   accessorKey: 'createdAt',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
  //   cell: ({ row }) => {
  //     return <div> {format(row.original.createdAt, "dd/MM/yyyy' at 'HH:mm")}</div>;
  //   },
  // },
  {
    accessorKey: 'actions',
    enableSorting: false,
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IoEllipsisVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={`/tournament/${row.original.id}/manage`} className="flex gap-2 items-center">
                <LuEye className="w-4 h-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 cursor-pointer"
              onClick={(e) => {
                end(row.original.id);
                e.stopPropagation();
              }}
            >
              <span className="flex gap-2 items-center">
                <LuTrash className="w-4 h-4" />
                End
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
