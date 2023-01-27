import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  /*subscribeBodySchema,*/
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

  //TO-DO: httpErrors.badRequest
  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {

      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });

      if (user === null) {
        throw fastify.httpErrors.badRequest('User not found');
      }
      
      const deletedUser = fastify.db.users.delete(request.params.id);
      return reply.send(deletedUser);
    }
  );

  //TO-DO: user, sub, httpErrors.badRequest
  /*fastify.post(
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

      const subTo = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      const updatedUser = await fastify.db.users.change(
        request.body.userId,
        { subscribedToUserIds: [...sub.subscribedToUserIds, request.params.id] },
      );

      return updatedUser;
    }
  );*/

  //TO-DO: user, unsub, httpErrors.badRequest
  /*fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {

      const unsub = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      const unsubFrom = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      const updatedUser = fastify.db.users.change(
        request.body.userId,
        { subscribedToUserIds: unsub.subscribedToUserIds}
      );

      return updatedUser;
    }
  );*/

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
