module.exports = {
    async execute(message) {
        let returnUsers = [];
        let someval = await message.reactions.cache.forEach(async (reaction) => {

            // const reactUsers = await reaction.users.fetch()
            // reactUsers.forEach(reactUser => {
            //     console.log(reactUser.id, reaction._emoji.name);
            //     returnUsers.push({ id: reactUser.id, emoji: reaction._emoji.name });
            //     return { id: reactUser.id, emoji: reaction._emoji.name };
            // });

            returnUsers.push({emoji: reaction._emoji.name, count: reaction.count});

        });
        return returnUsers;
    }
}