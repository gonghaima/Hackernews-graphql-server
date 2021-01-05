const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const fs = require('fs');
const path = require('path');
const { PubSub } = require('apollo-server');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');

// 1


const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Link: {
        votes: (parent, args, context) => {
            return context.prisma.link
                .findUnique({ where: { id: parent.id } })
                .votes();
        },
        postedBy: (parent, args, context) => {
            return context.prisma.link
                .findUnique({ where: { id: parent.id } })
                .postedBy();
        }
    },
    Vote: {
        link: (parent, args, context) => {
            return context.prisma.vote
                .findUnique({ where: { id: parent.id } })
                .link();
        },
        user: (parent, args, context) => {
            return context.prisma.vote
                .findUnique({ where: { id: parent.id } })
                .user();
        }
    }
}
const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );
