const Footer = () => {
  return (
    <footer className="py-4">
      <p className="mt-10 text-center text-sm leading-5 text-zinc-500">
        © <b>2023</b> Riftmaker, a project by{' '}
        <a href="https://github.com/Stormix/" target="_blank" rel="noopener noreferrer" className="text-accent">
          Stormix
        </a>
        .
        <br />
        Special thanks to{' '}
        <a href="" target="_blank" rel="noopener noreferrer" className="text-accent">
          Sandukhan
        </a>{' '}
        and{' '}
        <a href="" target="_blank" rel="noopener noreferrer" className="text-accent">
          EKB9816
        </a>{' '}
        for their help.
        <br />
        Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </p>
    </footer>
  );
};

export default Footer;
