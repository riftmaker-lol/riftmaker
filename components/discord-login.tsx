import { signIn } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa';
import { Button } from './ui/button';

const DiscordLogin = () => {
  const { tournamentId } = useParams();

  if (!tournamentId) return null;
  return (
    <Button onClick={() => signIn('discord', { callbackUrl: `/tournaments/${tournamentId}` })}>
      <FaDiscord className="mr-2 w-4 h-4" />
      <span>Sign in with Discord</span>
    </Button>
  );
};

export default DiscordLogin;
