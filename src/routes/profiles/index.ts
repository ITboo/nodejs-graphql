import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return reply.send(fastify.db.profiles.findMany());
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (profile === null) {
        throw fastify.httpErrors.notFound('Profile not found');
      }
      
      return reply.send(profile);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const newProfile = await fastify.db.profiles.create(request.body);
      return reply.send(newProfile);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {

      const deletedProfile = await fastify.db.profiles.delete(
        request.params.id
      );

      return reply.send(deletedProfile);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      
      const updatedProfile = await fastify.db.profiles.change(
        request.params.id,
        request.body
      );

      return reply.send(updatedProfile);
    }
  );
};

export default plugin;
