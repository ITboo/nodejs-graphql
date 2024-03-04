import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

import rootSchema from './schemas/root-schema.js';
import getDL from './dataloader/dataloader.js';
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

      const contextValue = {
        prismaClient: fastify.prisma,
        dataloaders: getDL(fastify.prisma),
      };

      const { data, errors } = await graphql({
        schema: rootSchema,
        source: query,
        variableValues: variables,
        contextValue,
      });

      return { data, errors };
    },
  });
};

export default plugin;