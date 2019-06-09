// Remember that graphQL playground is only active so long as process.env.NODE_ENV !== 'production'
import "./lib/env"						// uses dotenv to load <root>/.env variables
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
//import typeDefs from './graphql/schema'
//import resolvers from './graphql/resolvers'
import fs from 'fs'
import https from 'https'
import http from 'http'

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const configurations = {
  production: { ssl: true, port: 8443, hostname: 'example.com' },
  development: { ssl: false, port: 4000, hostname: '139.99.105.128' }
}

const environment = process.env.NODE_ENV || 'development'
const config = configurations[environment]

const apollo = new ApolloServer({
  typeDefs
, resolvers
, introspection: true
, playground: true
})

const app = express()
apollo.applyMiddleware({ app })

var server
if (config.ssl) {
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`)
    },
    app
  )
} else {
  server = http.createServer(app)
}

// Add subscription support
apollo.installSubscriptionHandlers(server)

server.listen({ port: config.port }, () => {
    console.log(
      '🚀 Server ready at',
      `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`
    )
    console.log(JSON.stringify(apollo))
  }
)
