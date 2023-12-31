'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ParticipantEntry } from '.';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { DataTableColumnHeader } from '../data-table-column-header';
import { toast, useToast } from '@/components/ui/use-toast';
import {
  allowPlayerInTournament,
  banPlayer,
  blacklistPlayerFromTournament,
  removePlayerFromTournament,
} from '@/app/tournament/[tournamentId]/actions';
import { sortByPlayerElo } from '@/lib/table';

export const columns: ColumnDef<Omit<ParticipantEntry, 'tournamentId' | 'id'>>[] = [
  {
    accessorKey: 'riotId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Riot ID" />,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Discord Name" />,
  },
  {
    accessorKey: 'elo',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rank" />,
    sortingFn: (rowA, rowB) => {
      return sortByPlayerElo(rowB.original, rowA.original);
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => {
      const player = row.original as ParticipantEntry;

      const allowUser = async () => {
        const { message } = await allowPlayerInTournament(player.tournamentId, player.id);
        if (message === 'Success') {
          toast({
            title: 'Success',
            description: 'User allowed to join tournament',
          });
        } else {
          toast({
            title: 'Error',
            description: message,
          });
        }
      };

      const blacklistUser = async () => {
        const { message } = await blacklistPlayerFromTournament(player.tournamentId, player.id);
        if (message === 'Success') {
          toast({
            title: 'Success',
            description: 'User blacklisted from tournament',
          });
        } else {
          toast({
            title: 'Error',
            description: message,
          });
        }
      };

      const removeUser = async () => {
        const { message } = await removePlayerFromTournament(player.tournamentId, player.id);
        if (message === 'Success') {
          toast({
            title: 'Success',
            description: 'Player removed',
          });
        } else {
          toast({
            title: 'Error',
            description: message,
          });
        }
      };

      const banUser = async () => {
        const { message } = await banPlayer(player.id);
        if (message === 'Success') {
          toast({
            title: 'Success',
            description: 'User banned from joining tournaments',
          });
        } else {
          toast({
            title: 'Error',
            description: message,
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IoEllipsisHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {player.kicked ? (
              <DropdownMenuItem onClick={() => allowUser()}>Allow user</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => blacklistUser()}>Blacklist user</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-500" onClick={() => removeUser()}>
              Remove player
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => banUser()}>
              Ban player
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
