'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AiOutlineTeam } from 'react-icons/ai';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import * as z from 'zod';
import { buttonVariants } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createTeam, rerollPlayer, saveTournamentTeam } from '@/app/dashboard/actions';
import { PlayerRole, Team, Tournament, User } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import { useState } from 'react';
import Loading from '../ui/loading';
import { IoRefreshSharp } from 'react-icons/io5';
import { Input } from '../ui/input';

const ranks = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
] as const;

const formSchema = z.object({
  elo: z.enum(ranks).optional(),
  random: z.boolean().optional(),
  teamName: z.string().optional(),
});

interface CreateTeamProps {
  tournament: Tournament;
}

type DraftedTeam = Record<
  PlayerRole,
  User & {
    filled: boolean;
  }
>;

const CreateTeam = ({ tournament }: CreateTeamProps) => {
  const [team, setTeam] = useState<DraftedTeam | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      elo: undefined,
      random: false,
      teamName: `Team ${uniqueNamesGenerator({
        dictionaries: [colors, animals],
        style: 'capital',
        separator: ' ',
      })}`,
    },
  });

  const watchRandom = form.watch('random', false);
  const watchElo = form.watch('elo', undefined);
  const watchTeamName = form.watch('teamName', '');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { message, data } = await createTeam(tournament.id, !!values.random, values.elo);

    if (message === 'Success') {
      const team = data?.team as Record<PlayerRole, User>;
      const filledPlayers = (data?.filledPlayers ?? []) as string[];

      const teamData = Object.entries(team).reduce((acc, [role, user]) => {
        acc[role as PlayerRole] = {
          ...user,
          filled: filledPlayers.includes(user.id),
        };
        return acc;
      }, {} as DraftedTeam);

      setTeam(teamData);
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const reroll = async (role: PlayerRole, team: Record<PlayerRole, User>) => {
    setLoading(true);
    const { message, data, fill } = await rerollPlayer(tournament.id, role, watchElo, team);
    if (message === 'Success') {
      setTeam({
        ...team,
        [role]: {
          ...(data as User),
          filled: fill,
        },
      } as DraftedTeam);
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const saveTeam = async () => {
    setLoading(true);
    const { message } = await saveTournamentTeam(tournament.id, watchTeamName!, team!);
    if (message === 'Success') {
      toast({
        title: 'Success',
        description: 'Team successfully saved',
      });
      setTeam(null);
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({}), 'items-center gap-2')}>
        <AiOutlineTeam className="w-4 h-4" />
        Create Team
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription className="text-sm">
            Either generate a random team in the same elo or create a fully random team.
          </DialogDescription>
          {team && (
            <div className="flex flex-col w-full gap-4">
              <h1 className="text-2xl font-bold text-center">Drafted Team</h1>
              <div className="flex flex-col gap-4 w-full">
                {Object.values(PlayerRole)
                  .filter((role) => role !== 'FILL')
                  .map((role) => {
                    const player = team[role];
                    return (
                      <div className="flex flex-row gap-4 items-center" key={role}>
                        <Label className="flex-grow">{role}</Label>
                        <div
                          className={cn('flex flex-row gap-4 items-center', {
                            'text-red-400': player?.filled,
                          })}
                        >
                          {player?.name} ({player?.elo} - {player?.role})
                        </div>
                        <IoRefreshSharp
                          className="w-4 h-4 cursor-pointer"
                          title="Reroll"
                          onClick={() => reroll(role, team)}
                        />
                      </div>
                    );
                  })}
              </div>

              <Button onClick={() => saveTeam()}>Save Team</Button>
              <Button variant={'link'} onClick={() => setTeam(null)}>
                Discard
              </Button>
            </div>
          )}
          {!team && (
            <div className="flex flex-row w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-row gap-4 items-center">
                      <Label className="flex-grow">Team Name</Label>
                      <FormField
                        control={form.control}
                        name="teamName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Team Name" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                      <Label className="flex-grow">Random rank</Label>
                      <FormField
                        control={form.control}
                        name="random"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {!watchRandom && (
                      <div className="flex flex-row gap-4 items-center">
                        <Label className="flex-grow">Team rank</Label>
                        <FormField
                          control={form.control}
                          name="elo"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-4">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an elo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ranks.map((rank) => (
                                    <SelectItem key={rank} value={rank}>
                                      {rank}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  <Button type="submit">
                    {loading ? <Loading /> : <AiOutlineTeam className="w-4 h-4 mr-2" />}
                    Draft Team
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeam;
