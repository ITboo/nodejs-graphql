import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';

/*Чтобы заставить graphql работать, вам надо импортировать graphql функцию из пакета graphql, передать ей необходимые параметры и вернуть клиенту результат запуска этой функции*/
import { graphql, GraphQLSchema, validate } from 'graphql';

//import  from 'graphql-depth-limit';

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
        query: await ,
        mutation: await ,
      });

//const errors = validate

      return await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
        variableValues: variables, //All dynamic values should be sent via "variables" field.
      });
    }
  );
};

export default plugin;

/*
 Передача fastify в contextValue, позволит обращаться к инстансу сервера в качестве третьего параметра функции 
resolve(source, args, context){}
Непосредственно в резолвере удобно обращаться к серверу, через 
fastify.inject({
              method: 'POST',
              url: '/users',
              payload: args,
            })
*/