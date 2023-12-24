import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const DesktopRedirect = async ({ params }: { params: { page: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect('/');

  const { page } = params;
  if (!page) return redirect('/');

  const token = cookies().get('next-auth.session-token')?.value; // TODO: figure out a better way to do this.

  switch (page) {
    case 'login':
      redirect(`riftmaker://login?token=${token}`);
    default:
      redirect(`riftmaker://${page}`);
  }
};

export default DesktopRedirect;
