'use client';

import { saveTournamentTeam } from '@/app/dashboard/actions';
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
import { Lanes, Ranks } from '@/lib/draft';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlayerRole, User } from '@prisma/client';
import { memo, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineTeam } from 'react-icons/ai';
import { HiMiniCog8Tooth } from 'react-icons/hi2';
import { MdOutlineRefresh } from 'react-icons/md';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import * as z from 'zod';
import { buttonVariants } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from '../ui/use-toast';
import PlayerSlot from './player-slot';
import Roulette, { Player } from './roulette';

interface PickRandomProps {
  tournamentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  elo: z.enum(Ranks).optional().or(z.literal('random')),
  duration: z.coerce.number().min(1).optional(),
});

const PickRandom = ({ tournamentId, open, onOpenChange }: PickRandomProps) => {
  const [team, setTeam] = useState<Record<Exclude<PlayerRole, 'FILL'>, Player | undefined>>({
    TOP: undefined,
    JUNGLE: undefined,
    MID: undefined,
    ADC: undefined,
    SUPPORT: undefined,
  });

  const [duration, setDuration] = useState<number>(10);
  const [running, setRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectLane, setSelectedLane] = useState<Exclude<PlayerRole, 'FILL'> | undefined>(undefined);

  const [current, setCurrent] = useState<{
    elo: z.infer<typeof formSchema>['elo'];
    player: string | undefined;
  }>({
    elo: 'random',
    player: undefined,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      elo: 'random',
      duration: duration,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCurrent({
      elo: values.elo,
      player: undefined,
    });
    setDuration(values.duration ?? 10);

    toast({
      title: 'Roulette Configured',
      description: 'The roulette has been configured and is ready to spin!',
    });
  };

  const nextUnfilledRole = useMemo(() => {
    if (!selectLane) {
      return Object.entries(team).find(([_, player]) => !player)?.[0] as Exclude<PlayerRole, 'FILL'> | undefined;
    }
    return selectLane;
  }, [selectLane, team]);

  const teamFull = useMemo(() => {
    return Object.values(team).every((player) => player !== undefined);
  }, [team]);

  const saveTeam = async () => {
    setLoading(true);
    const { message } = await saveTournamentTeam(
      tournamentId,
      `Team ${uniqueNamesGenerator({
        dictionaries: [colors, animals],
        style: 'capital',
        separator: ' ',
      })}`,
      team as unknown as Record<PlayerRole, User>,
    );
    if (message === 'Success') {
      toast({
        title: 'Success',
        description: 'Team successfully saved',
      });
      setTeam({
        TOP: undefined,
        JUNGLE: undefined,
        MID: undefined,
        ADC: undefined,
        SUPPORT: undefined,
      });
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: 'secondary',
          }),
          'items-center gap-2',
        )}
      >
        <MdOutlineRefresh className="w-4 h-4" />
        Pick Random
      </DialogTrigger>
      <DialogContent className="max-w-3xl gap-8 text-center" loading={loading}>
        <DialogHeader>
          <DialogTitle>Player Roulette</DialogTitle>
          <DialogDescription>
            <p>
              Spin the roulette to draft players for the team. Drafts are ordered by lanes (Top, Jungle, Mid, ADC,
              Support). Once the 5 players are drafted, the team can be created and added to the tournament.
            </p>

            <p className="text-red-300 mt-4">
              P.S: If there are not enough players for a specific lane, players will be drafted from other lanes.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn('grid grid-cols-5 gap-2', {
            'border-accent border-2 rounded-md p-2 animate-pulse': teamFull,
          })}
        >
          {Lanes.map((lane) => (
            <PlayerSlot
              key={lane}
              role={lane}
              player={team[lane]}
              onRemove={() => setTeam((prev) => ({ ...prev, [lane]: undefined }))}
              selected={selectLane === lane}
              onSelect={(lane) => {
                setSelectedLane(lane);
              }}
            />
          ))}
        </div>
        {teamFull && (
          <>
            <Button size={'lg'} variant={'accent'} className="w-fit mx-auto" onClick={() => saveTeam()}>
              <AiOutlineTeam className="w-6 h-6 mr-4" />
              Create Team
            </Button>
          </>
        )}

        {current && (
          <Roulette
            tournamentId={tournamentId}
            elo={current.elo === 'random' ? undefined : current.elo}
            role={nextUnfilledRole}
            deactivate={teamFull}
            filterPlayerIds={
              Object.values(team)
                .map((player) => player?.id)
                .filter(Boolean) as string[]
            }
            config={{
              duration: duration * 1000,
            }}
            onStateChange={(state) => {
              setRunning(state === 'running');
            }}
            onLockIn={(player) => {
              setTeam((prev) => {
                const role = nextUnfilledRole;
                if (!role) {
                  console.warn('Should not happen');
                  return prev;
                }
                return {
                  ...prev,
                  [role]: player,
                };
              });
              setSelectedLane(undefined);
            }}
          />
        )}

        <div className="flex w-full gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full">
              <div className="flex gap-4">
                <div className="flex flex-row gap-4 items-center flex-grow">
                  <Label className="flex-grow">Rank</Label>
                  <FormField
                    control={form.control}
                    name="elo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className=" w-full">
                              <SelectValue placeholder="Select an elo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={'random'}>Random</SelectItem>
                            {Ranks.map((rank) => (
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
                <div className="flex flex-row gap-4 items-center">
                  <Label className="flex-grow">Roulette Duration (s)</Label>
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Spin duration (default: 10s)" type="number" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={running}>
                  <HiMiniCog8Tooth className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(PickRandom);
