import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import {MEMBER_TYPE_NOT_FOUND} from '../../constants/errors';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {

  fastify.get('/', async function (request, reply): Promise<MemberTypeEntity[]> {
    return reply.send(fastify.db.memberTypes.findMany());
  });

  fastify.get('/:id', {
    schema: {
      params: idParamSchema,
    },
  },

    async function (request, reply): Promise<MemberTypeEntity> {

      const mType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (mType === null) {
        throw fastify.httpErrors.notFound(MEMBER_TYPE_NOT_FOUND);
      }

      return reply.send(mType);
    }
  );

  fastify.patch('/:id', {
    schema: {
      body: changeMemberTypeBodySchema,
      params: idParamSchema,
    },
  },
    async function (request, reply): Promise<MemberTypeEntity> {
      try {

        const newType = await fastify.db.memberTypes.change(
          request.params.id,
          request.body
        );

        return reply.send(newType);
      } catch (err:any) {
        throw fastify.httpErrors.badRequest(err);
      }
    }
  );
};

export default plugin;
