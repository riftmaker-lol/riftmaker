import { validateRiotId } from './lib/riot';

const riotId = 'Abde#0003';

const main = async () => {
  console.log(await validateRiotId(riotId));
};

main();
