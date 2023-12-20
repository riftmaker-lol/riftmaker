import { cn } from '@/lib/utils';
import React from 'react';

import { FaDiscord, FaEnvelope, FaGithub } from 'react-icons/fa6';

const Socials: React.FC<{
  className?: string;
}> = ({ className }) => {
  const socials = [
    {
      label: 'Discord',
      icon: <FaDiscord />,
      url: 'https://discord.gg/CDbE4J3eaY',
    },
    {
      label: 'Github',
      icon: <FaGithub />,
      url: 'https://github.com/riftmaker-lol/',
    },
    {
      label: 'Email',
      icon: <FaEnvelope />,
      url: 'mailto:hello@stormix.co',
    },
  ];
  return (
    <div className={cn('z-50 flex flex-row items-center w-full gap-4 p-4 lg:w-4 lg:flex-col lg:bg-none', className)}>
      <span className="flex flex-grow lg:hidden">Get in touch: </span>

      {socials.map((social) => (
        <a
          key={social.url}
          href={social.url}
          target="_blank"
          className="transition-colors hover:text-primary"
          rel="noreferrer"
        >
          {social.icon}
        </a>
      ))}
      <div className="h-12 ml-[5px] border-l border-white hidden lg:flex" />
    </div>
  );
};

export default Socials;
