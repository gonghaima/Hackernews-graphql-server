const link = (parent, args, context) => {
    return context.prisma.vote
        .findUnique({ where: { id: parent.id } })
        .link();
},
const user = (parent, args, context) => {
    return context.prisma.vote
        .findUnique({ where: { id: parent.id } })
        .user();
}

module.exports = {
    link,
    user
};
