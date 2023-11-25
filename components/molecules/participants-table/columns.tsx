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
import { allowPlayerInTournament, banPlayer, kickPlayerFromTournament } from '@/app/tournament/[tournamentId]/actions';

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
    accessorKey: 'rank',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rank" />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
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

      const kickUser = async () => {
        const { message } = await kickPlayerFromTournament(player.tournamentId, player.id);
        if (message === 'Success') {
          toast({
            title: 'Success',
            description: 'User kicked from tournament',
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IoEllipsisHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {player.kicked ? (
              <DropdownMenuItem onClick={() => allowUser()}>Allow user</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => kickUser()}>Kick user</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-500" onClick={() => banUser()}>
              Ban user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
