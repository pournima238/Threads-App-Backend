import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { PrismaClient } from '@prisma/client';
import createGraphQLServer from './graphql/index.js';
import { UserService } from './services/user.js';

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;
  app.use(express.json());

  const prisma = new PrismaClient();

  app.get('/', (req, res) => {
    res.json('Server is running');
  });

  const gqlServer = await createGraphQLServer();

  app.use(
    '/graphql',
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        console.log("token from header",token);
        try {
          if (typeof token === 'string') {
            const user = UserService.decodeToken(token);
            return { user };
          } 
        }catch(err){
          console.error("Token verification failed:", err);
        }
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
