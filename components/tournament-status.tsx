import { cn } from '@/lib/utils';
import { TournamentStatus } from '@prisma/client';
import { LuFlag, LuBan, LuBoxSelect } from 'react-icons/lu';
import { RiFireLine } from 'react-icons/ri';

interface StatusProps {
  status: TournamentStatus;
  className?: string;
  size?: 'sm' | 'lg';
}

const Status = ({ status, className, size = 'lg' }: StatusProps) => {
  const baseStyling = cn(
    'flex text-gray-500 gap-2 items-center justify-center rounded-full border border-2',
    className,
    {
      'py-1 px-4': size === 'lg',
    },
    {
      'text-xs py-1 px-2': size === 'sm',
    },
  );

  switch (status) {
    case TournamentStatus.CREATED:
      return (
        <div className={cn(baseStyling, '')}>
          <LuBoxSelect className="w-4 h-4" />
          <span>Created</span>
        </div>
      );
    case TournamentStatus.ACCEPTING_PARTICIPANTS:
      return (
        <div className={cn(baseStyling, 'border-sky-700 bg-sky-700 text-white')}>
          <LuFlag className="w-4 h-4" />
          <span>Accepting participants</span>
        </div>
      );
    case TournamentStatus.READY:
      return (
        <div className={cn(baseStyling, 'border-accent bg-accent text-white')}>
          <RiFireLine className="w-4 h-4" /> <span>On Going</span>
        </div>
      );
    case TournamentStatus.FINISHED:
      return (
        <div className={cn(baseStyling, 'text-white')}>
          <LuBan className="w-4 h-4" /> <span>Ended</span>
        </div>
      );
    default:
      return null;
  }
};

export default Status;
