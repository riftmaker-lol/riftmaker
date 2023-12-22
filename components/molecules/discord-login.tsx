'use client';

import { signIn } from 'next-auth/react';
import { redirect, useParams, useSearchParams } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa';
import { Button } from '../ui/button';
import { Session } from 'next-auth';

interface DiscordLoginProps {
  session: Session | null;
}

const DiscordLogin = ({ session }: DiscordLoginProps) => {
  const { tournamentId } = useParams();
  const params = useSearchParams();

  const defaultRedirectTo = tournamentId ? `/tournament/${tournamentId}` : '/';
  const callbackUrl = params.get('callbackUrl') ?? defaultRedirectTo;

  if (session) {
    return redirect(callbackUrl);
  }

  return (
    <Button variant={'discord'} onClick={() => signIn('discord', { callbackUrl: callbackUrl })}>
      <FaDiscord className="mr-2 w-4 h-4" />
      <span>Sign in with Discord</span>
    </Button>
  );
};

export default DiscordLogin;
