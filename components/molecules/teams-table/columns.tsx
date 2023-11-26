'use client';

import { ColumnDef } from '@tanstack/react-table';
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
  removeTeamFromTournament,
} from '@/app/tournament/[tournamentId]/actions';
import { TeamEntry } from '.';
import { FaRegCopy } from 'react-icons/fa6';
import { PlayerRole } from '@prisma/client';
import { cn } from '@/lib/utils';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { sortByRole } from '@/lib/draft';

export const columns: ColumnDef<Omit<TeamEntry, 'tournamentId'>>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Team Name" />,
  },
  {
    accessorKey: 'players',
    header: ({ column }) => {
      return (
        <div className="grid grid-cols-5 gap-4">
          {Object.values(PlayerRole)
            .filter((role) => role !== PlayerRole.FILL)
            .map((role) => (
              <span key={role} className="font-bold text-sm">
                {role}
              </span>
            ))}
        </div>
      );
    },
    cell: ({ row }) => {
      const team = row.original as TeamEntry;
      return (
        <div className="grid grid-cols-5 gap-4">
          {team.players
            .sort((a, b) => sortByRole(a, b))
            .map((player) => (
              <div key={player.id} className="flex flex-col gap-1 ">
                <span
                  className={cn('text-sm flex gap-2', {
                    'text-red-400': player.role !== player.mainRole,
                  })}
                >
                  {player.riotId}
                  <FaRegCopy
                    className="w-4 h-4 ml-2 cursor-pointer"
                    title="Copy invite link"
                    onClick={() => {
                      navigator.clipboard.writeText(player.riotId);
                      toast({
                        title: 'Copied to clipboard',
                      });
                    }}
                  />
                </span>
                <span className="text-sm text-gray-500">{player.name}</span>
              </div>
            ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const team = row.original as TeamEntry;

      const removeTeam = async () => {
        const { message } = await removeTeamFromTournament(team.tournamentId, team.id);
        if (message === 'Success') {
          toast({
            title: 'Success',
            description: 'Team removed',
          });
        } else {
          toast({
            title: 'Error',
            description: message,
          });
        }
      };

      return (
        <Button variant={'outline'} onClick={removeTeam}>
          <MdOutlineDeleteOutline className="w-4 h-4" title="Remove team" />
        </Button>
      );
    },
  },
];
