import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { PrismaClient } from '@prisma/client';



 // ✅ fixed import

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;
  app.use(express.json());

  const prisma = new PrismaClient();

  // Apollo server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }

      type Mutation { 
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello World from GraphQL',
        say: (_, { name }: { name: string }) => `Hello ${name} from GraphQL`,
      },
      Mutation: {
        createUser: async (_, { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {
          await prisma.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: 'randomsalt',
            },
          });
          return true;
        },
      },
    },
  });

  await gqlServer.start();

  app.get('/', (req, res) => {
    res.json('Server is running');
  });

  app.use('/graphql', expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
