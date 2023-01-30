import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import {USER_NOT_FOUND} from '../../constants/errors';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id })

      if (user === null) {
        throw fastify.httpErrors.notFound(USER_NOT_FOUND)
      }

      return user;
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
      const newUser = await fastify.db.users.create(request.body)
      return newUser;
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
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id })
      if (user === null) {
        throw fastify.httpErrors.badRequest()
      }

      const posts = await fastify.db.posts.findMany({ key: 'userId', equals: request.params.id })
      await Promise.all(posts.map(async (post) => {
        await fastify.db.posts.delete(post.id)
      }))

      const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.params.id })
      profile && await fastify.db.profiles.delete(profile.id)

      const subs = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: request.params.id })
      await Promise.all(subs.map(async (user) => {
        const { id, ...changes } = user
        const newSub = changes.subscribedToUserIds.filter(id => id !== request.params.id)
        return await fastify.db.users.change(user.id, { ...changes, subscribedToUserIds: newSub })
      }))

      const deletedUser = await fastify.db.users.delete(request.params.id)
      return deletedUser;
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
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId })

      if (user === null) {
        throw fastify.httpErrors.badRequest()
      }

      user.subscribedToUserIds.push(request.params.id)

      const { id, ...changes } = user
      const updatedUser = await fastify.db.users.change(request.body.userId, changes)

      return updatedUser;
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
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId })

      if (user === null) {
        throw fastify.httpErrors.badRequest()
      }
      if (!user.subscribedToUserIds.includes(request.params.id)) {
        throw fastify.httpErrors.badRequest()
      }

      const newSub = user.subscribedToUserIds.filter(id => id !== request.params.id)

      const { id, ...changes } = user
      const updatedUser = await fastify.db.users.change(request.body.userId, { ...changes, subscribedToUserIds: newSub })

      return updatedUser;
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
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id })

      if (user === null) {
        throw fastify.httpErrors.badRequest()
      }

      const updatedUser = await fastify.db.users.change(request.params.id, request.body)
      return updatedUser;
    }
  );
};

export default plugin;