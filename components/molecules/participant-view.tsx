'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from 'zod';

const formSchema = z.object({
  tournamentId: z.string().min(1),
});

const ParticipantView = () => {
  const { data: session } = useSession();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentId: '',
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const tournamentId = values.tournamentId.split('/').pop();

    if (!tournamentId) {
      toast({
        description: 'Invalid tournament ID',
      });
      return;
    }

    router.push(`/tournament/${tournamentId}`);
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex flex-col gap-4 w-full">
        <p></p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <p className="text-xl">Join a tournament:</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-end w-full">
            <FormField
              control={form.control}
              name="tournamentId"
              render={({ field }) => (
                <FormItem className="flex w-full">
                  <FormControl>
                    <Input
                      placeholder="https://riftmaker.vercel.app/tournament/<id>"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Join</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ParticipantView;
