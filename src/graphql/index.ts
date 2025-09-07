import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { User } from './user/index.js';

async function createGraphQLServer() {
  const prisma = new PrismaClient();

  const gqlServer = new ApolloServer({
    typeDefs: `
     ${User.typeDefs}
      type Query {
        ${User.queries}
        getContext:String
      }

      type Mutation { 
        ${User.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        getContext:(_parent:any,_args:any,contextValue:any)=>{
          console.log("contextValue",contextValue);
          return "okay";
        }
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
