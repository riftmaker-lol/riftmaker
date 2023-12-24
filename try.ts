import { validateRiotId } from './lib/riot';

const riotId = 'Stormix#lurk';

const main = async () => {
  console.log(await validateRiotId(riotId));
};

main();
