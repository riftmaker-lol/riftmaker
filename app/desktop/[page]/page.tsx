import { redirect, useParams } from 'next/navigation';

const DesktopRedirect = ({ params }: { params: { page: string } }) => {
  const { page } = params;
  if (!page) return redirect('/');

  const token = 'test';

  switch (page) {
    case 'login':
      redirect(`riftmaker://login?token=${token}`);
    default:
      redirect(`riftmaker://${page}`);
  }
};

export default DesktopRedirect;
