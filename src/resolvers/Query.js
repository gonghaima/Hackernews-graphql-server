
const info = () => `This is the API of a Hackernews Clone`;
// 2
const feed = async (parent, args, context) => {
    console.log(`context.invalidRequet: ${context.invalidRequet}`);
    if (context.invalidRequet) return null;
    return context.prisma.link.findMany();
}


module.exports = {
    info,
    feed
};
