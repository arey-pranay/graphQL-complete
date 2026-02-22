import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloExpressMiddleware } from "@as-integrations/express4";
import { readFile } from "node:fs/promises";
import { resolvers } from "./resolvers.js";
import { getUser } from "./db/users.js";
// the main learning is about graphql, so let's start with creating an Apollo Server instance.
const typeDefs = await readFile("./schema.graphql", "utf-8");

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});
await apolloServer.start();

const app = express(); // creating an Express application. this is our backend application that will handle all the requests and responses.
app.use(cors(), express.json(), authMiddleware); // middlewares for all requests
app.use(
    "/graphql",
    apolloExpressMiddleware(apolloServer, { context: getContext }),
); // middleware for "/graphql" requests
//pair the app to a port and start listening for requests
const PORT = 9000;
app.listen({ port: PORT }, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});

// Authentication route (whenever /login is requested, handleLogin will be called)
app.post("/login", handleLogin);

async function getContext({ req }) {
    if (req.auth) {
        let user = await getUser(req.auth.sub);
        return { user };
    }
    return {};
}
