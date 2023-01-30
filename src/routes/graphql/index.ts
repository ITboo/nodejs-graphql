import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';

/*Чтобы заставить graphql работать, вам надо импортировать graphql функцию из пакета graphql, передать ей необходимые параметры и вернуть клиенту результат запуска этой функции*/
import { graphql, GraphQLSchema, /*validate*/ } from 'graphql';
/*нужно описать какие сущности знает сервер (например user и у него есть такие-то поля), а потом написать т.н. ресолверы (resolvers) которые будут возвращать эти данные по требованию (например все юзеры, или юзер с айди 1)*/
import { query } from './graphQLSchema/query';
import { mutation } from './graphQLSchema/mutation';

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
        query: query,
        mutation: mutation,
      });

      //const errors = validate

      return await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
        variableValues: request.body.variables, //All dynamic values should be sent via "variables" field.
      });
    }
  );
};

export default plugin;
/*сначала вызываются множественные postsLoader.load(id) - хоть 100 штук

под капотом даталодер "накапливает" эти айдишники и передаёт их массивом в функцию, переданную в конструктор даталодера

там, получив массив userIds мы делаем 1 запрос в БД и формируем мапу со структурой, которую ты описала, и в ответе отдаём массив в такой же очередности, как пришли айдишники в userIds (изменено)
[16:26]
читать тут https://www.npmjs.com/package/dataloader - Batch function*/