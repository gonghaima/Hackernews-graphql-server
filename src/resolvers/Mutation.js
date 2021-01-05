
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


module.exports = {
    post,
    vote
};
