import {
    GraphQLID,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

export const GraphQLProfile = new GraphQLObjectType({
    name: 'GraphQLProfile',
    fields: () => ({
        id: { type: GraphQLString },
        userId: { type: GraphQLID },
        memberTypeId: { type: GraphQLString },
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLInt },
        country: { type: GraphQLString },
        city: { type: GraphQLString },
        street: { type: GraphQLString },
    }),
});

export const CreateProfile= new GraphQLInputObjectType({
	name: 'CreateProfileInput',
	fields: {
		avatar: { type: new GraphQLNonNull(GraphQLString) },
		sex: { type: new GraphQLNonNull(GraphQLString) },
		birthday: { type: new GraphQLNonNull(GraphQLInt) },
		country: { type: new GraphQLNonNull(GraphQLString) },
		street: { type: new GraphQLNonNull(GraphQLString) },
		city: { type: new GraphQLNonNull(GraphQLString) },
		userId: { type: new GraphQLNonNull(GraphQLID) },
		memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
	},
});

export const UpdateProfile = new GraphQLInputObjectType({
	name: 'UpdateProfileInput',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		avatar: { type: GraphQLString },
		sex: { type: GraphQLString },
		birthday: { type: GraphQLInt },
		country: { type: GraphQLString },
		street: { type: GraphQLString },
		city: { type: GraphQLString },
		memberTypeId: { type: GraphQLString },
	},
});