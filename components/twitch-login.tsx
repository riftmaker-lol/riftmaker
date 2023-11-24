import { signIn } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { FaTwitch } from 'react-icons/fa';
import { Button } from './ui/button';

const TwitchLogin = () => {
  const { tournamentId } = useParams();

  if (!tournamentId) return null;
  return (
    <Button onClick={() => signIn('twitch', { callbackUrl: `/tournaments/${tournamentId}` })}>
      <FaTwitch className="mr-2 w-4 h-4" />
      <span>Connect twitch account</span>
    </Button>
  );
};

export default TwitchLogin;
