## Introduction

[graphql.org](http://graphql.org) is the docs

Helps fixing underFetching and overFetching by giving us preciseFetching

There’s just a /graphql route where you post a request

Graphql helped facebook optimize their API latency on mobile devices especially

## Fundamentals

we use type definitions (typedef) to define the graphQL schemas, it has things that can be requested by the client

we use resolvers to tell what needs to be done when the client queries anything from typeDef, based on the queried type

npm i graphql @apollo/server is what we need to set up a basic graphql backend

then create an instance of ApolloServer, pass that instance into the startStandaloneServer function, and you’ll get a promise. await that promise to run the server

a get request on the server always gives a sandbox (i.e., opening it in browser), we can use it to see responses of different operations

we can also use a code-first approach where the resolver is written at the same place as the query type, as javascript code. no graphql schema definition language. (SDL)

### Schema

![alt text](image.png)

### Steps:

Add your query or mutation in schema
Create a resolver for your q or m
Create a DB-interacting utility function to call in your resolver
Go to sandbox and create a valid request
Go to frontend, create a client call for that resolver in your queries-mutations file and put the request
Call the frontend utility function wherever needed
