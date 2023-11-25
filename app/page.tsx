import ParticipantView from '@/components/molecules/participant-view';
import { Button } from '@/components/ui/button';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 container">
      <h1 className="text-5xl font-bold">Salam, bghiti t9sser?</h1>

      <div className="flex flex-row gap-4 my-auto w-full items-center">
        <div className="flex w-1/2 border-right border-accent px-8">
          <ParticipantView />
        </div>

        <div className="flex w-1/2">
          <Button className="gap-2" size={'lg'}>
            <MdOutlineAdminPanelSettings className="w-4 h-4" />
            Organizer view
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
