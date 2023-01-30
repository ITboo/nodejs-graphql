import {
    GraphQLObjectType,
    GraphQLList
} from 'graphql';
import {
    GraphQLUser,
    GraphQLProfile,
    GraphQLPost,
    GraphQLMemberType
} from '../types/index';

/* функция resolve() принимает 3 аргумента. Добавь их, и выведи - там третьим аргументов будет фастифай. resolve(parent, args, fastify)*/
export const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        //USER
        users: {
            type: new GraphQLList(GraphQLUser),
            async resolve(parent, args, fastify) { return await fastify.db.users.findMany() }
        },
        user: {
            type: GraphQLUser,
            async resolve(parent, args, fastify) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });
                if (user === null) {
                    throw fastify.httpErrors.notFound();
                }
                return user;
            }
        },
        // PROFILE
        profiles: {
            type: new GraphQLList(GraphQLProfile),
            async resolve(parent, args, fastify) { return await fastify.db.profiles.findMany() }
        },
        profile: {
            type: GraphQLProfile,
            async resolve(parent, args, fastify) {
                const profile = await fastify.db.profiles.findOne({ key: 'id', equals: args.id });
                if (profile === null) {
                    throw fastify.httpErrors.notFound();
                }
                return profile;
            }
        },
        //POST
        posts: {
            type: new GraphQLList(GraphQLPost),
            async resolve(parent, args, fastify) { return await fastify.db.posts.findMany() }
        },
        post: {
            type: GraphQLPost,
            async resolve(parent, args, fastify) {
                const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id });
                if (post === null) {
                    throw fastify.httpErrors.notFound();
                };
                return post;
            }
        },
        //MEMBER-TYPE
        memberTypes: {
            type: new GraphQLList(GraphQLMemberType),
            async resolve(parent, args, fastify) { return fastify.db.memberTypes.findMany() }
        },
        memberType: {
            type: GraphQLMemberType,
            async resolve(parent, args, fastify) {
                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });
                if (memberType === null) {
                    throw fastify.httpErrors.notFound();
                }
                return memberType;
            }
        }
    }
}
);