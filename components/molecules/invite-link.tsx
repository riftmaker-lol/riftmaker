'use client';

import { env } from '@/env.mjs';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Tournament } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import { FaDiscord, FaRegCopy } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Link from 'next/link';

const InviteLink = ({ tournament }: { tournament: Tournament }) => {
  const inviteLink = `${env.NEXT_PUBLIC_BASE_URL}/tournament/${tournament.id}`;
  const setupCommand = `/setup tournament:${tournament.id}`;

  const { toast } = useToast();
  const { copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-8">
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
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-semibold">Discord command:</h3>
        <div className="flex flex-row gap-4">
          <Input value={setupCommand} readOnly />
          <div className="flex flex-row gap-4">
            <Button
              variant={'outline'}
              onClick={() => {
                copy(setupCommand);
                toast({
                  description: 'Copied setup command to clipboard',
                });
              }}
            >
              <FaRegCopy className="w-4 h-4 mr-2" title="Copy command" />
              Copy command
            </Button>
          </div>
          <div className="flex flex-row gap-4">
            <Button asChild variant={'discord'}>
              <Link
                href={`https://discord.com/api/oauth2/authorize?client_id=1177712225692172418&permissions=1101710502912&scope=bot`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord className="w-4 h-4 mr-2" title="Add bot to server" />
                Invite Bot
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteLink;
