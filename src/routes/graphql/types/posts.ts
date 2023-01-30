import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

export const GraphQLPost = new GraphQLObjectType({
    name: 'GraphQLPost',
    fields: () => ({
        id: { type: GraphQLString },
        userId: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    }),
});

export const CreatePost = new GraphQLInputObjectType({
	name: 'CreatePostInput',
	fields: {
		content: { type: new GraphQLNonNull(GraphQLString) },
		title: { type: new GraphQLNonNull(GraphQLString) },
		userId: { type: new GraphQLNonNull(GraphQLID) },
	},
});

export const UpdatePost = new GraphQLInputObjectType({
	name: 'UpdatePostInput',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		content: { type: GraphQLString },
		title: { type: GraphQLString },
	},
});