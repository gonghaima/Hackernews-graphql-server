
const info = () => `This is the API of a Hackernews Clone`;
// 2
const feed = async (parent, args, context) => {
    return context.prisma.link.findMany()
}


module.exports = {
    info,
    feed
};
