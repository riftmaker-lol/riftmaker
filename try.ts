import { validateRiotId } from './lib/riot';

const riotId = 'bouzzy#euw';

const main = async () => {
  console.log(await validateRiotId(riotId));
};

main();
