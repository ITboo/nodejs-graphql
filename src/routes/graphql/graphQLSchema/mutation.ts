import {
  GraphQLObjectType,
  GraphQLNonNull
} from "graphql";
import {
  GraphQLUser,
  CreateUser,
  UpdateUser,
  GraphQLProfile,
  CreateProfile,
  UpdateProfile,
  GraphQLPost,
  CreatePost,
  UpdatePost,
  GraphQLMemberType,
  UpdateMemberType
} from '../types/index';


export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //CREATE

    createUser: {
      type: GraphQLUser,
      args: { user: { type: new GraphQLNonNull(CreateUser) } },
      async resolve(parent, args, fastify) {
        return await fastify.db.users.create(args.user);
      }
    },

    createProfile: {
      type: GraphQLProfile,
      args: { profile: { type: new GraphQLNonNull(CreateProfile) } },
      async resolve(parent, args, fastify) {
        return await fastify.db.profiles.create(args.profile);
      }
    },

    createPost: {
      type: GraphQLPost,
      args: { post: { type: new GraphQLNonNull(CreatePost) } },
      async resolve(parent, args, fastify) {
        return await fastify.db.posts.create(args.post);
      }
    },

    //UPDATE
    updateUser: {
      type: GraphQLUser,
      args: { user: { type: new GraphQLNonNull(UpdateUser) } },
      async resolve(parent, args, fastify) {
        try {
          const { id, ...body } = args.user;
          return await fastify.db.users.change(id, body);
        } catch (err: any) {
          throw fastify.httpErrors.badRequest();
        }
      }
    },

    updateProfile: {
      type: GraphQLProfile,
      args: { profile: { type: new GraphQLNonNull(UpdateProfile) } },
      async resolve(parent, args, fastify) {
        try {
          const { id, ...body } = args.profile;
          return await fastify.db.profiles.change(id, body);
        } catch (err: any) {
          throw fastify.httpErrors.badRequest();
        }
      }
    },

    updatePost: {
      type: GraphQLPost,
      args: { post: { type: new GraphQLNonNull(UpdatePost) } },
      async resolve(parent, args, fastify) {
        try {
          const { id, ...body } = args.post;
          return await fastify.db.posts.change(id, body);
        } catch (err: any) {
          throw fastify.httpErrors.badRequest();
        }
      }
    },

    updateMember: {
      type: GraphQLMemberType,
      args: { member: { type: new GraphQLNonNull(UpdateMemberType) } },
      async resolve(parent, args, fastify) {
        try {
          const { id, ...body } = args.member;
          return await fastify.db.memberTypes.change(id, body);
        } catch (err: any) {
          throw fastify.httpErrors.badRequest();
        }
      }
    }
  }
})
