const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const fs = require('fs');
const path = require('path');
const { PubSub } = require('apollo-server');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');

// 1

const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Link,
    Vote
}
const prisma = new PrismaClient();

const mockInvalidPromise = () => Promise.resolve(false);

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: async ct => {
        // get the user token from the headers
        const connection = ct.connection;
        const req = ct.req;
        const token = req?.headers?.authorization || '';

        console.log(`<<<=============================================================`);
        console.log('token:');
        console.log(token);
        console.log(!token);

        console.log('headers auth:');
        console.log(req?.headers?.authorization);
        console.log('connection auth:');
        console.log(connection?.context?.authorization);
        // if (!token) throw new AuthenticationError('you must be logged in');
        // const invalidRequet = !token ? true : false;
        const invalidRequet = await mockInvalidPromise();
        console.log(`invalidRequet: ${invalidRequet}`);
        console.log(`=============================================================>>>`);
        return {
            ...req,
            prisma,
            pubsub,
            invalidRequet
        };
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );
