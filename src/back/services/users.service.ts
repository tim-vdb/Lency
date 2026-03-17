import { UsersAction } from '../repositories/users.action';

export const UsersService = {
  findByEmail: async (email: string) => {
    return UsersAction.findByEmail(email);
  },
};
