import CallToAction from '@/components/atoms/call-to-action';
import Socials from '@/components/atoms/socials';
import Vector1 from '@/components/atoms/vector1';
import Vector2 from '@/components/atoms/vector2';

const Home = async () => {
  return (
    <>
      <Vector1 className="vector1" />
      <Vector2 className="vector2" />
      <main className="flex flex-col flex-grow items-center p-24 container z-10">
        <div className="flex flex-col gap-8 my-auto text-center justify-center items-center">
          <h1 className="text-[72px] font-bold font-lol my-auto leading-tight">
            Streamlined League of Legends Tournaments
          </h1>
          <p className="text-lg">
            Create and manage League of Legends tournaments effortlessly with our powerful tournament organization tool
            designed for streamers.
          </p>
          <CallToAction />
        </div>
        <Socials className="fixed bottom-0 left-32" />
      </main>
    </>
  );
};

export default Home;
