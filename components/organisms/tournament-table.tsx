'use client';

import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Tournament } from '@prisma/client';
import { format } from 'date-fns';
import { FaRegCopy } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { endTournament } from '@/app/dashboard/actions';

interface TournamentWithLink extends Pick<Tournament, 'id' | 'name' | 'createdAt'> {
  inviteLink: string;
  participants: number;
}

interface TournamentTableProps {
  tournaments: TournamentWithLink[];
  actions?: {
    view: boolean;
    end: boolean;
  };
}

const TournamentTable = ({
  tournaments,
  actions = {
    view: true,
    end: true,
  },
}: TournamentTableProps) => {
  const { toast } = useToast();
  const { copy } = useCopyToClipboard();

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
    <div className="py-8">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-zinc-500">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                  Invite link
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold w-52">
                  # of participants
                </th>

                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold w-5">
                  Created At
                </th>

                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 w-24">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-500">
              {tournaments.map((tournament) => (
                <tr key={tournament.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">{tournament.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex flex-row gap-2 items-center">
                      <pre className="text-primary">{tournament.inviteLink}</pre>
                      <FaRegCopy
                        className="w-4 h-4 text-accent cursor-pointer"
                        title="Copy invite link"
                        onClick={() => {
                          copy(tournament.inviteLink);
                          toast({
                            description: 'Copied invite link to clipboard',
                          });
                        }}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm w-5">{tournament.participants}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm w-5">
                    {format(tournament.createdAt, "dd/MM/yyyy' at 'HH:mm")}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0  w-24">
                    {actions.view && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          window.location.href = `/tournament/${tournament.id}/manage`;
                        }}
                      >
                        View
                      </Button>
                    )}
                    {actions.end && (
                      <Button className="ml-2" variant="outline" onClick={() => end(tournament.id)}>
                        End
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TournamentTable;
