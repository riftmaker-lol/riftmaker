import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CiCirclePlus } from 'react-icons/ci';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { MdOutlineRefresh } from 'react-icons/md';
import { Tournament } from '@prisma/client';

interface CreateTeamProps {
  tournament: Tournament;
}

const PickRandom = ({ tournament }: CreateTeamProps) => {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PickRandom;
