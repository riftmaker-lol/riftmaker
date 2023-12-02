'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { Tournament, User } from '@prisma/client';
import { participateInTournament } from '@/app/tournament/[tournamentId]/actions';
import { Session } from 'next-auth';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

const formSchema = z.object({
  riotId: z.custom<`${string}#${string}` | 'string'>((val) => {
    return typeof val === 'string' && val.length > 0;
  }, "Riot ID can't be empty"),
});

interface ParticipateFormProps {
  tournament: Tournament & {
    participants: User[];
  };
  session: Session;
}

const ParticipateForm = ({ tournament, session }: ParticipateFormProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      riotId: (session?.user.riotId ?? '') as `${string}#${string}`,
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { message } = await participateInTournament(values.riotId, tournament.id);
    if (message === 'Success') {
      form.reset();
      toast({
        title: 'Success',
        description: 'You have successfully participated in the tournament',
      });
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const joined = tournament.participants.some((p) => p.email === session.user.email);

  return (
    <div className="flex flex-col gap-2">
      <Label className="font-bold">Riot ID or Summoner Name:</Label>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="items-center gap-4 flex-row flex">
          <FormField
            control={form.control}
            name="riotId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Hassan#1234" {...field} readOnly={joined} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!joined && (
            <Button type="submit" loading={loading}>
              Join
            </Button>
          )}
          {joined && (
            <Button type="submit" variant="outline" disabled>
              Joined
            </Button>
          )}
        </form>
        <ul className="list-disc list-inside">
          <li>
            Get it from:
            <a href="https://account.riotgames.com/" className="text-yellow-500 ml-2">
              https://account.riotgames.com/
            </a>
          </li>

          <li>
            Ensure your profile is up to date:
            <a href="https://mobalytics.gg/lol" className="text-yellow-500 ml-2">
              https://mobalytics.gg/lol
            </a>
          </li>

          <li>
            First try your riot ID: <b>Hassan#123</b>, if that doesn&apos;t work, try your summoner name: <b>Hassan</b>.
          </li>
        </ul>
      </Form>
    </div>
  );
};

export default ParticipateForm;
