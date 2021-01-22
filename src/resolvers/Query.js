const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

const info = () => `This is the API of a Hackernews Clone`;
// 2
const feed = async (parent, args, context) => {
    if (!context.accessToken) return null;
    console.log(`context.token: ${context.accessToken}`);
    let validRequest = false;
    try {
        const tokenVerificationResult = await jwt.verify(context.accessToken, APP_SECRET);
        const user = await context.prisma.user.findUnique({
            where: { id: tokenVerificationResult.userId }
        });
        if (user.id && user.name && user.email) validRequest = true;
    } catch (error) {
        console.log("error happend:" + error);
    }

    if (!validRequest) return null;

    return context.prisma.link.findMany();
}


module.exports = {
    info,
    feed
};
