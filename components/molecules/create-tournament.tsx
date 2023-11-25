'use client';

import * as z from 'zod';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FaCirclePlus } from 'react-icons/fa6';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { createTournament } from '@/app/dashboard/actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const createTournamentForm = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
});

const CreateTournament = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof createTournamentForm>>({
    resolver: zodResolver(createTournamentForm),
    defaultValues: {
      name: uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        style: 'capital',
        separator: ' ',
      }),
    },
  });

  const onSubmit = async (values: z.infer<typeof createTournamentForm>) => {
    const { message, id } = await createTournament(values.name);
    if (message === 'Success') {
      form.reset();
      toast({
        title: 'Success',
        description: 'Tournament created successfully',
      });
      router.push(`/tournament/${id}/manage`);
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants())}>
        <div className="flex gap-4 items-center">
          <FaCirclePlus className="w-4 h-4" /> Create Tournament
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New tournament</DialogTitle>
          <DialogDescription className="mb-4">
            Name doesn&apos;t matter, just put something random. You can change it later.
          </DialogDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tournament Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTournament;
