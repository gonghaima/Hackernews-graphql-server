const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const fs = require('fs');
const path = require('path');
const { PubSub } = require('apollo-server');
const Subscription = require('./resolvers/Subscription');

// 1


const pubsub = new PubSub();

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        // 2
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
    },
    Mutation: {
        // 2
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            });
            context.pubsub.publish("NEW_LINK", newLink);
            return newLink;
        },
        vote: async (parent, args, context, info) => {
            const { userId } = context;
            const vote = await context.prisma.vote.findUnique({
                where: {
                    linkId_userId: {
                        linkId: Number(args.linkId),
                        userId: userId || 1
                    }
                }
            });

            if (Boolean(vote)) {
                throw new Error(
                    `Already voted for link: ${args.linkId}`
                );
            }

            const newVote = context.prisma.vote.create({
                data: {
                    user: { connect: { id: userId || 1 } },
                    link: { connect: { id: Number(args.linkId) } }
                }
            });
            context.pubsub.publish('NEW_VOTE', newVote);

            return newVote;
        }
    },
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
