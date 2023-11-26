'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Session } from 'next-auth';

const Actions = ({ session }: { session: Session | null }) => {
  const router = useRouter();

  if (!session) {
    return (
      <div className="flex">
        <Button variant={'outline'} onClick={() => router.push('/api/auth/signin')}>
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex">
      {session.user.isAdmin && (
        <Button variant={'outline'} onClick={() => router.push('/dashboard')}>
          Dashboard
        </Button>
      )}

      <Button variant={'link'} onClick={() => router.push('/api/auth/signout')}>
        Log out ?
      </Button>
    </div>
  );
};

export default Actions;
