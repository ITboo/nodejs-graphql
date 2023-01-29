import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async function (): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (profile === null) {
        throw fastify.httpErrors.notFound();
      }

      return profile;
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const mType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });

      if (mType === null) {
        throw fastify.httpErrors.badRequest();
      }

      const user = await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId });

      if (user) {
        throw fastify.httpErrors.badRequest();
      }

      const profile = await fastify.db.profiles.create(request.body);

      return profile;
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (profile === null) {
        throw fastify.httpErrors.badRequest();
      }

      const deletedProfile = await fastify.db.profiles.delete(request.params.id);

      return deletedProfile;
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      if (request.body.memberTypeId !== undefined) {
        const mType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });

        if (mType === null) {
          throw fastify.httpErrors.badRequest();
        }
      }

      try {
        const updatedProfile = await fastify.db.profiles.change(request.params.id, request.body);
        return updatedProfile;

      } catch (err: any) {
        throw fastify.httpErrors.badRequest(err);
      }
    },
  );
};

export default plugin;
