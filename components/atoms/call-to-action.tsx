'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface CallToActionProps {
  className?: string;
}

const CallToAction = ({ className }: CallToActionProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const start = () => {
    if (session?.user.isAdmin) {
      router.push('/dashboard');
    } else {
      router.push('/api/auth/signin');
    }
  };

  return (
    <div className={cn('flex flex-row gap-4', className)}>
      <Button variant={'default'} size={'xl'} onClick={() => start()}>
        Get Started
      </Button>
      <Button asChild variant={'outline'} size={'xl'}>
        <a href="https://github.com/riftmaker-lol/riftmaker" target="_blank" rel="noopener noreferrer">
          Contribute
        </a>
      </Button>
    </div>
  );
};

export default CallToAction;
