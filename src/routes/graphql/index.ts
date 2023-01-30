import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';

/*Чтобы заставить graphql работать, вам надо импортировать graphql функцию из пакета graphql, передать ей необходимые параметры и вернуть клиенту результат запуска этой функции*/
import { graphql, GraphQLSchema, validate } from 'graphql';
/*нужно описать какие сущности знает сервер (например user и у него есть такие-то поля), а потом написать т.н. ресолверы (resolvers) которые будут возвращать эти данные по требованию (например все юзеры, или юзер с айди 1)*/
import { query } from './query';

//import  from 'graphql-depth-limit';

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
      const schema = new GraphQLSchema({
        query: query,
        mutation: mutation,
      });

      //const errors = validate

      return await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
        variableValues: variables, //All dynamic values should be sent via "variables" field.
      });
    }
  );
};

export default plugin;