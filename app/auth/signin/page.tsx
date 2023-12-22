import DiscordLogin from '@/components/molecules/discord-login';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect, useSearchParams } from 'next/navigation';

const SignIn = async () => {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col items-center p-24 flex-grow justify-center">
      <div className="flex flex-col w-8/12 gap-16 items-center justify-center text-center p-12 border-white/20 border ">
        <Image src="/icon.svg" width={64} height={64} alt="Riftmaker" />
        <p>Welcome, Summoner! Join the riftmaker and unleash your inner champion!</p>
        <DiscordLogin session={session} />
      </div>
    </main>
  );
};

export default SignIn;
