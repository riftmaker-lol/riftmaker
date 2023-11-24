'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import NotLoggedIn from './not-loggedin';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { participateInTournament } from './actions';

const formSchema = z.object({
  riotId: z.custom<`${string}#${string}` | ''>((val) => {
    return typeof val === 'string' && val.length > 0 ? val.includes('#') : false;
  }, "A sidi, riot ID dialek, machi summoner name e.g: 'sidi#1234'"),
});

export default function Tournament() {
  const { data: session } = useSession();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      riotId: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { message } = await participateInTournament(values.riotId, tournamentId);
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
  };

  if (!session) {
    return <NotLoggedIn />;
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <h1 className="text-4xl font-bold">Tournament #{tournamentId}</h1>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-4">
          <p>
            Connected as <b>{session.user?.name}</b>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="riotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Riot ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Stormix#lurk" {...field} />
                    </FormControl>
                    <FormDescription>
                      Get it from:
                      <a href="https://account.riotgames.com/" className="text-accent ml-2">
                        https://account.riotgames.com/
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Participate</Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
