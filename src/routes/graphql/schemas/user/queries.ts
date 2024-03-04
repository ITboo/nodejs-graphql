import { GraphQLList } from 'graphql';

import { ContextType } from '../../types/context.js';
import { UUIDType } from '../../types/uuid.js';

import { UserType } from './types.js';

const UserQueries = {
  user: {
    type: UserType,
    args: { id: { type: UUIDType } },
    resolve: async (_parent: unknown, args: { id: string }, context: ContextType) => {
      const user = await context.prismaClient.user.findUnique({ where: { id: args.id } });
      return user;
    },
  },

  users: {
    type: new GraphQLList(UserType),
    resolve: async (_parent: unknown, _args: unknown, context: ContextType) => {
      const users = await context.prismaClient.user.findMany();
      return users;
    },
  },
};

export default UserQueries;