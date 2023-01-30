import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema, validate, parse, ExecutionResult } from 'graphql';
import { query } from './graphQLSchema/query';
import { mutation } from './graphQLSchema/mutation';

import * as depth_limit from 'graphql-depth-limit';

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

      const DEPTH_LIMIT = 6;
      const errors = validate(schema, parse(request.body.query!), [depth_limit(DEPTH_LIMIT)]);

      if (errors.length > 0) {
        const validateResult: ExecutionResult = { //ExecutionResult represents the result of execution.
          data: null,
          errors: errors,
        };

        return validateResult;
      }

      return await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
        variableValues: request.body.variables,
      });
    }
  );
};

export default plugin;
/*сначала вызываются множественные postsLoader.load(id) - хоть 100 штук

под капотом даталодер "накапливает" эти айдишники и передаёт их массивом в функцию, переданную в конструктор даталодера

там, получив массив userIds мы делаем 1 запрос в БД и формируем мапу со структурой, которую ты описала, и в ответе отдаём массив в такой же очередности, как пришли айдишники в userIds (изменено)
[16:26]
читать тут https://www.npmjs.com/package/dataloader - Batch function*/