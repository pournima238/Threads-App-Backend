import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { PrismaClient } from '@prisma/client';
import createGraphQLServer from './graphql/index.js';
// import createGraphQLServer from "./graphql";




 // ✅ fixed import

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;
  app.use(express.json());

  const prisma = new PrismaClient();


  app.get('/', (req, res) => {
    res.json('Server is running');
  });

  app.use('/graphql', expressMiddleware(await createGraphQLServer()));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
