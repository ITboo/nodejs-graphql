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
    const users = reply.send(fastify.db.users.findMany());   //получаем всех пользователей
    return users;
  });

  //получаем пользователя по id
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
      return user;
    }
  );

  //создаём нового пользователя
  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const newUser = fastify.db.users.create(request.body);
      return newUser;
    }
  );

  //удаляем пользователя
  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const deletedUser = fastify.db.users.delete(request.params.id);
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
     /* const sub = fastify.db.users.change(request.params.id);
      return sub;*/

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
    /*const unsub =  fastify.db.users.change(request.params.id);
    return unsub;*/
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
      return updatedUser;
    }
  );
};

export default plugin;
