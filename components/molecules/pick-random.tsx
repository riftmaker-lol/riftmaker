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
import { Lanes, Ranks } from '@/lib/draft';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { GiRollingDices } from 'react-icons/gi';
import { MdOutlineRefresh } from 'react-icons/md';
import * as z from 'zod';
import { buttonVariants } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import PlayerSlot from './player-slot';
import Roulette from './roulette';

interface PickRandomProps {
  tournamentId: string;
}

const formSchema = z.object({
  elo: z.enum(Ranks).optional(),
  role: z.enum(Lanes).optional(),
});

const PickRandom = ({ tournamentId }: PickRandomProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      elo: undefined,
      role: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <Dialog>
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
      <DialogContent className="max-w-3xl gap-8">
        <DialogHeader>
          <DialogTitle>Player Roulette</DialogTitle>
          <DialogDescription>Stormix 3afak zid description</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-2">
          {Lanes.map((lane) => (
            <PlayerSlot key={lane} role={lane} player={undefined} />
          ))}
        </div>

        <Roulette tournamentId={tournamentId} />

        <div className="flex w-full gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-row gap-4 items-center">
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
                  <Label className="flex-grow">Role</Label>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Lanes.map((lane) => (
                              <SelectItem key={lane} value={lane}>
                                {lane}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit">
                <GiRollingDices className="w-4 h-4 mr-2" />
                Start Roulette
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(PickRandom);
