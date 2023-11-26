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
import { createTeam } from '@/app/dashboard/actions';
import { Team, Tournament } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import { useState } from 'react';

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
  teamName: z.string().max(20),
});

interface CreateTeamProps {
  tournament: Tournament;
}

const CreateTeam = ({ tournament }: CreateTeamProps) => {
  const [team, setTeam] = useState<unknown>();
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { message, data } = await createTeam(tournament.id, !!values.random, values.teamName, values.elo);

    console.log(message, data);

    if (message === 'Success') {
      setTeam(data as unknown);
      toast({
        title: 'Team created',
        description: 'Your team has been created.',
      });
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const watchRandom = form.watch('random', false);

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: 'outline',
          }),
          'items-center gap-2',
        )}
      >
        <AiOutlineTeam className="w-4 h-4" />
        Create Team
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription className="text-sm">
            Either generate a random team in the same elo or create a fully random team.
          </DialogDescription>
          <div className="flex flex-row w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
                <div className="flex flex-col gap-4 w-full">
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
                <Button type="submit">Create Team</Button>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeam;
