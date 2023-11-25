'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4">
        <p></p>
      </div>
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-end">
            <FormField
              control={form.control}
              name="tournamentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament ID or invite link?</FormLabel>
                  <FormControl>
                    <Input placeholder="http://riftmaker.thembassy." {...field} className="w-full" />
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
