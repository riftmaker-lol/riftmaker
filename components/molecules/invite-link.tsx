'use client';

import { env } from '@/env.mjs';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Tournament } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import { FaRegCopy } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const InviteLink = ({ tournament }: { tournament: Tournament }) => {
  const inviteLink = `${env.NEXT_PUBLIC_BASE_URL}/tournament/${tournament.id}`;

  const { toast } = useToast();
  const { copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-3xl font-semibold">Invite link:</h3>
      <div className="flex flex-row gap-4">
        <Input value={inviteLink} readOnly />
        <Button
          variant={'outline'}
          onClick={() => {
            copy(inviteLink);
            toast({
              description: 'Copied invite link to clipboard',
            });
          }}
        >
          <FaRegCopy className="w-4 h-4 mr-2" title="Copy invite link" />
          Copy link
        </Button>
      </div>
    </div>
  );
};

export default InviteLink;
