import {
    GraphQLID,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

export const GraphQLMemberType = new GraphQLObjectType({
    name: 'GraphQLMemberType',
    fields: () => ({
        id: { type: GraphQLString },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
    }),
});

export const UpdateMemberType = new GraphQLInputObjectType({
	name: 'UpdateMemberInput',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		discount: { type: GraphQLInt },
		monthPostsLimit: { type: GraphQLInt },
	},
});