'use client';

import { useSession } from 'next-auth/react';

export default function AuthStatus() {
  const { data: session } = useSession();

  return (
    <div className="absolute top-5 w-full flex justify-center items-center">
      {session && <p className="text-sm">Signed in as {session.user?.name}</p>}
    </div>
  );
}
