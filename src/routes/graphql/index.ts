import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';

/*Чтобы заставить graphql работать, вам надо импортировать graphql функцию из пакета graphql, передать ей необходимые параметры и вернуть клиенту результат запуска этой функции*/
import { graphql, GraphQLSchema } from 'graphql';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const schema: GraphQLSchema = new GraphQLSchema({
        query: //MyAppQueryRootType,
        mutation: //MyAppMutationRootType
      });
      return await graphql();
    }
  );
};

export default plugin;
