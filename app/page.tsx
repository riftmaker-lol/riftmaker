import ParticipantView from '@/components/molecules/participant-view';

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 container">
      <h1 className="text-5xl font-bold">Salam, bghiti t9sser?</h1>

      <div className="flex flex-row gap-4 my-auto w-full items-center">
        <ParticipantView />
      </div>
    </main>
  );
};

export default Home;
