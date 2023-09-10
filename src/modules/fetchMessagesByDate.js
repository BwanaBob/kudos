module.exports = {
    async execute(startDate, endDate, interaction) {
        let lastId;
        let startDateReached = false;
        let messages = [];
        let messagesFetched = 0;
        while (!startDateReached) {
            const messagesBatch = await interaction.channel.messages.fetch({ limit: 20, before: lastId });
            messagesFetched += messagesBatch.size;
            lastId = messagesBatch.last().id;
            messagesBatch.forEach((message) => {
                if (message.createdTimestamp / 1000 > endDate) { return; }
                if (message.createdTimestamp / 1000 < startDate) { startDateReached = true; return; }
                messages.push(message);
              })
            if (messagesBatch.size != 20 || messagesFetched >= 5000) {
                // sleep(10000);
                break;
            }
        }
        // console.log(messages);
        return messages;
    }
}