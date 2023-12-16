import { PlayerRole, User } from '@prisma/client';
import Image from 'next/image';
import { FaRegCopy, FaTimes } from 'react-icons/fa';
import { Player } from './roulette';
import { cn } from '@/lib/utils';
import { toast } from '../ui/use-toast';

interface PlayerSlotProps {
  role: Exclude<PlayerRole, 'FILL'>;
  player?: Player;
  selected?: boolean;
  onRemove?: (player: Player) => void;
  onSelect?: (role: Exclude<PlayerRole, 'FILL'> | undefined) => void;
}

const PlayerSlot = ({ role, player, selected, onSelect, onRemove }: PlayerSlotProps) => {
  return (
    <div className="flex justify-end flex-col h-full gap-4">
      {player ? (
        <div className="flex flex-col gap-1 items-center">
          <span className={cn('text-sm flex gap-1')}>
            {player.riotId}
            <FaRegCopy
              className="w-4 h-4 ml-2 cursor-pointer"
              title="Copy invite link"
              onClick={() => {
                navigator.clipboard.writeText(player.riotId);
                toast({
                  title: 'Copied to clipboard',
                });
              }}
            />
          </span>
          <span className="text-sm text-gray-500">{player.name}</span>
          <span className="text-sm text-gray-500">{player.elo}</span>
        </div>
      ) : (
        <div className="h-4" />
      )}

      <div
        className="flex items-center flex-col gap-2 relative group cursor-pointer"
        onClick={() => {
          onSelect && onSelect(role);
        }}
      >
        {player && (
          <div
            onClick={() => {
              onRemove && onRemove(player);
            }}
            className={cn(
              'absolute top-0 w-24 h-24 bg-black rounded-full justify-center items-center border-2 opacity-0 group-hover:opacity-75 cursor-pointer flex duration-300 ease-in-out',
              {
                'border-accent': selected,
              },
            )}
          >
            <FaTimes className="w-6 h-6" title="Remove" />
          </div>
        )}

        <div
          className={cn('w-24 h-24 bg-secondary rounded-full flex justify-center items-center border-2', {
            'border-accent': selected,
          })}
        >
          {player ? (
            <Image src={player.image!} alt={player.name!} className={cn('rounded-full')} width={128} height={128} />
          ) : (
            <span className="text-sm font-bold">{role}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSlot;
