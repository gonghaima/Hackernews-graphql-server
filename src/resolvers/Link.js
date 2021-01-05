const votes = (parent, args, context) => {
    return context.prisma.link
        .findUnique({ where: { id: parent.id } })
        .votes();
};

const postedBy = (parent, args, context) => {
    return context.prisma.link
        .findUnique({ where: { id: parent.id } })
        .postedBy();
};

module.exports = {
    votes,
    postedBy
};
