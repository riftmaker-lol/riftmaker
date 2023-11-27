import LoadingIndicator from '@/components/loading-indicator';

const LoadingPage = () => {
  return (
    <div className="h-[80vh] w-screen flex justify-center items-center">
      <LoadingIndicator variant="logo" className="w-24 h-24" />
    </div>
  );
};

export default LoadingPage;
