import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

import rootSchema from './schemas/root-schema.js';
import { DEPTH_LIMIT, ERROR_MESSAGE } from './constants.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const {
        body: { query, variables },
      } = req;

      const validateErrors = validate(rootSchema, parse(query), [
        depthLimit(DEPTH_LIMIT),
      ]);

      if (validateErrors.length) {
        return {
          data: {
            message: ERROR_MESSAGE,
          },
          errors: validateErrors,
        };
      }
      
      const { data, errors } = await graphql({
        schema: rootSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prismaClient: fastify.prisma },
      });
      return { data, errors };
    },
  });
};

export default plugin;
