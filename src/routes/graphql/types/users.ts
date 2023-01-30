import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import { POST_NOT_FOUND, PROFILE_NOT_FOUND } from '../../../constants/errors';

import { GraphQLPost, GraphQLProfile, GraphQLMemberType } from './index';

export let GraphQLUser: GraphQLObjectType
GraphQLUser = new GraphQLObjectType({
  name: 'GraphQLUser',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: GraphQLProfile,
      async resolve(parent, args, fastify) {
        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: parent.id });
        if (profile === null) {
          throw fastify.httpErrors.notFound(PROFILE_NOT_FOUND);
        }
        return profile;
      }
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      async resolve(parent, args, fastify) {
        const posts = await fastify.db.posts.findMany({ key: 'userId', equals: parent.id });
        if (posts === null) {
          throw fastify.httpErrors.notFound(POST_NOT_FOUND);
        }
        return posts;
      }
    },
    memberType: {
      type: GraphQLMemberType,
      async resolve(parent, args, fastify) {
        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: parent.id });
        if (profile === null) {
          throw fastify.httpErrors.notFound();
        }
        return fastify.db.memberTypes.findOne({
          key: "id",
          equals: profile.memberTypeId,
        });
      }
    },
      userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      async resolve(parent, args, fastify) {
        return fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: parent.id });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      async resolve(parent, args, fastify) {
        return fastify.db.users.findMany({ key: 'id', equalsAnyOf: parent.subscribedToUserIds });
      }
    }
  })
});

export const CreateUser = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const UpdateUser = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});
