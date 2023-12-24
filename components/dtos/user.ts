import { User } from '@prisma/client';

export const userDto = (user: User) => ({
  id: user.id,
  name: user.name,
  riotId: user.riotId,
  elo: user.elo,
  role: user.role,
  accountId: user.accountId,
  image: user.image,
});
