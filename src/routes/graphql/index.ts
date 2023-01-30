import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema, validate, parse, ExecutionResult } from 'graphql';
import { query } from './graphQLSchema/query';
import { mutation } from './graphQLSchema/mutation';

import * as depth_limit from 'graphql-depth-limit';
import { DEPTH_LIMIT } from '../../constants/depthLimit';


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
