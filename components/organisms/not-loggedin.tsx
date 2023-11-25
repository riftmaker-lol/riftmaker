'use client';

import DiscordLogin from '../molecules/discord-login';

const NotLoggedIn = () => {
  return (
    <div className="w-screen h-screen  items-center flex justify-center gap-4 ">
      <p className="text-3xl font-semibold">Tconnecta layhfdek: </p>
      <DiscordLogin />
    </div>
  );
};

export default NotLoggedIn;
