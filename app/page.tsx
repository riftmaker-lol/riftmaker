import ParticipantView from '@/components/molecules/participant-view';

const Home = () => {
  return (
    <main className="flex flex-col items-center p-24 container">
      <h1 className="text-[96px] font-bold font-lol">Salam, bghiti t9sser?</h1>
      <div className="flex flex-row gap-4 my-auto w-full items-center">
        <ParticipantView />
      </div>
    </main>
  );
};

export default Home;
