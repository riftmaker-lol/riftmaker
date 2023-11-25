'use client';

import { useRouter } from 'next/navigation';
import { FiChevronLeft } from 'react-icons/fi';
import { Button } from '../ui/button';

const BackButton = () => {
  const router = useRouter();

  return (
    <Button className="w-fit" onClick={() => router.push('/dashboard')}>
      <FiChevronLeft className="mr-2" />
      Back to dashboard
    </Button>
  );
};

export default BackButton;
