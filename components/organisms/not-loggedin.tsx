'use client';

import DiscordLogin from '../molecules/discord-login';

const NotLoggedIn = () => {
  return (
    <div className="m-auto items-center flex justify-center gap-4 ">
      <p className="text-3xl font-semibold">Please sign in</p>
      <DiscordLogin session={null} />
    </div>
  );
};

export default NotLoggedIn;
