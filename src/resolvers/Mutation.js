
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

const post = (parent, args, context, info) => {
    const newLink = context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
        },
    });
    context.pubsub.publish("NEW_LINK", newLink);
    return newLink;
};

const vote = async (parent, args, context, info) => {
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
};

const signup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({
        data: { ...args, password }
    });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user
    };
}

const login = async (parent, args, context, info) => {
    const user = await context.prisma.user.findUnique({
        where: { email: args.email }
    });
    if (!user) {
        throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(
        args.password,
        user.password
    );
    if (!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user
    };
}

module.exports = {
    post,
    vote,
    signup,
    login
};
