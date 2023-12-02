import { PlayerRole, User } from '@prisma/client';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { Player } from './roulette';

interface PlayerSlotProps {
  role: PlayerRole;
  player?: Player;
  onRemove?: (player: Player) => void;
}

const PlayerSlot = ({ role, player, onRemove }: PlayerSlotProps) => {
  return (
    <div className="flex items-center flex-col gap-2 relative group">
      {player && (
        <div
          onClick={() => {
            onRemove && onRemove(player);
          }}
          className="absolute top-0 w-24 h-24 bg-black rounded-full  justify-center items-center opacity-0 group-hover:opacity-75 cursor-pointer flex duration-300 ease-in-out"
        >
          <FaTimes className="w-6 h-6" title="Remove" />
        </div>
      )}
      <div className="w-24 h-24 bg-secondary rounded-full flex justify-center items-center">
        {player ? (
          <Image src={player.image!} alt={player.name!} className="rounded-full" width={128} height={128} />
        ) : (
          <span className="text-sm font-bold">{role}</span>
        )}
      </div>
    </div>
  );
};

export default PlayerSlot;
