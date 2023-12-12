import LoadingIndicator from '@/components/loading-indicator';
import ParticipantView from '@/components/molecules/participant-view';
import Roulette from '@/components/molecules/roulette';

const Home = () => {
  return (
    <main className="flex flex-col h-[80vh] items-center p-24 container">
      <h1 className="text-[96px] font-bold font-lol my-auto">v0.1 - Alpha test</h1>
      <p>There are few known bugs...Will fixed them soon!</p>
    </main>
  );
};

export default Home;
