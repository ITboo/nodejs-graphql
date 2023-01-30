/*var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
});*/

import {
  GraphQLObjectType,//Almost all of the GraphQL types you define will be object types. Object types have a name, but most importantly describe their fields.
  GraphQLInputObjectType,// input object defines a structured collection of fields which may be supplied to a field argument.
  GraphQLID, //represents an ID.
  GraphQLList,// list is a kind of type marker, a wrapping type which points to another type.
  GraphQLString,//represents a string.
  GraphQLNonNull//Using NonNull will ensure that a value must be provided by the query
} from 'graphql';

export const GraphQLUser = new GraphQLObjectType({
  name: 'GraphQLUser',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    /*profile: {},
    posts: {},
    memberType: {},
    subscribedToUser: {},
    userSubscribedTo: {},*/
  }),
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
