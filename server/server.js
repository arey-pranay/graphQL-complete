import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// the below hash (#) comment is for editor and syntax highlighting
const typeDefs = `#graphql
    type Query {
        greeting: String # Greeting is something that can now be queried
    }

    schema{
        # query(used by the client to query data) is by default of the type Query, but we can explicitly define it here for clarity
        query: Query # this is the entry point for our queries, it tells the server that when a query is made, it should look at the Query type for the structure of the query
    }
`;

const resolvers = {
    Query: {
        greeting: () => "Hello, world!", // the value (arrow function in this case) is what will be returned when the greeting query is executed
    },
};

// now let's create the server with our type definitions and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// let's run the server and listen on port 4000
const serverPromise = startStandaloneServer(server, {
    listen: { port: 4000 },
});

const { url } = await serverPromise;
console.log(`Server is running at ${url}`);
