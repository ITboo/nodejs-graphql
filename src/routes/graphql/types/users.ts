/*var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
});*/

import {
    GraphQLID, //represents an ID.
    GraphQLList,// list is a kind of type marker, a wrapping type which points to another type.
    GraphQLObjectType,//Almost all of the GraphQL types you define will be object types. Object types have a name, but most importantly describe their fields.
    GraphQLString,//represents a string.
} from 'graphql';

export const GraphQLUser = new GraphQLObjectType({
    name: 'GraphQLUser',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    }),
});

/*
export const CreateUser
export const UpdateUser
*/