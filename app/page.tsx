import AuthStatus from '@/components/auth-status';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AuthStatus />
    </main>
  );
}
