import { SqlDatabase } from 'brackets-prisma-db';
import { BracketsManager } from 'brackets-manager';

import prisma from './prisma';

const storage = new SqlDatabase(prisma);

const manager = new BracketsManager(storage);

export default manager;
