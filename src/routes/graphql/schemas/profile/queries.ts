import { GraphQLList } from 'graphql';

import { ContextType } from '../../types/context.js';
import { UUIDType } from '../../types/uuid.js';

import { ProfileType } from './types.js';

const ProfileQueries = {
  profile: {
    type: ProfileType,
    args: { id: { type: UUIDType } },
    resolve: async (_parent: unknown, args: { id: string }, context: ContextType) => {
      const profile = await context.prismaClient.profile.findUnique({
        where: { id: args.id },
      });
      return profile;
    },
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_parent: unknown, _args: unknown, context: ContextType) => {
      const profiles = await context.prismaClient.profile.findMany();
      return profiles;
    },
  },

};

export default ProfileQueries;
