import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { User } from './user/index.js';

async function createGraphQLServer() {
  const prisma = new PrismaClient();

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        ${User.queries}
      }

      type Mutation { 
        ${User.mutations}
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello from GraphQL",
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  await gqlServer.start();
  return gqlServer;
}

export default createGraphQLServer;
