const getMutation = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => new GraphQLObjectType({
    name: '',
    fields: {
        
      createUser: {
        type: GraphQLUser,
        args: {
          variables: {
            type: new GraphQLNonNull(CreateUserInput),
          },
        },
        resolve: async (_, args) => createUserFromInput(args.variables, fastify),
      },



    }
    }
    )
    