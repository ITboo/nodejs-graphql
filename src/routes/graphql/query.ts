import {
    GraphQLObjectType,
    GraphQLList
} from 'graphql';
import {
    GraphQLUser
} from './types/index'

export const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {},
        user: {},
        profiles: {},
        profile: {},
        posts: {},
        post: {},
        memberTypes: {},
        memberType: {}
    }
}
);