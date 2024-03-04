import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql';

import { ContextType } from '../../types/context.js';
import { UUIDType } from '../../types/uuid.js';
import { UserType } from '../user/types.js';

export type PostSchemaType = {
  id: string;
  authorId: string;
  title: string;
  content: string;
};

export const PostType: GraphQLObjectType<PostSchemaType, ContextType> =
  new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: { type: UUIDType },
      authorId: { type: UUIDType },
      title: { type: GraphQLString },
      content: { type: GraphQLString },

      author: {
        type: UserType,
        resolve: async (parent, _args: unknown, context: ContextType) => {
          const postAuthor = await context.prismaClient.user.findUnique({
            where: { id: parent.authorId },
          });
          return postAuthor;
        },
      },
    }),
  });

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    authorId: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});