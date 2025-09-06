import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';


async function init(){
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

//create apollo server
const gqlServer = new ApolloServer({
  typeDefs:`
  type Query {
  hello:String
  say(name:String):String
  }
  `,
  resolvers:{
    Query:{
        hello:()=> 'Hello World from GraphQL',
        say:(_,{name}:{name:string})=> `Hello ${name} from GraphQL`
    }
  },
});

//start the gql server
await gqlServer.start();

app.get('/', (req, res) => {
  res.json('Server is running');
});

app.use('/graphql',expressMiddleware(gqlServer));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}

init();
