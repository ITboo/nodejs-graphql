import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {

  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    const users = reply.send(fastify.db.users.findMany());
    return users;
  });

  //в options помимо id нужен тип сопоставления (DBEntity.ts)
  
  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {

      const user = fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (user === null) {
        throw fastify.httpErrors.notFound('User not found');
      };

      return reply.send(user);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const newUser = fastify.db.users.create(request.body);
      return reply.send(newUser);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const deletedUser = fastify.db.users.delete(request.params.id);
      return reply.send(deletedUser);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const sub = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const unsub = fastify.db.users.change(request.params.id);
      return reply.send(unsub);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const updatedUser = fastify.db.users.change(
        request.params.id,
        request.body
      );
      return reply.send(updatedUser);
    }
  );
};

export default plugin;
