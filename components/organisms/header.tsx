import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import HeaderActions from '../molecules/header-actions';

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex px-24 py-8 justify-between text-primary w-full">
      <Link href="/">
        <Image src="/logo.svg" width={194} height={35} alt={'Riftmaker'} />
      </Link>

      <HeaderActions session={session} />
    </div>
  );
};

export default Header;
