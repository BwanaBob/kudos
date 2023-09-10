const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    inlineCode,
} = require("discord.js");
const fetchMessages = require("../modules/fetchMessagesByDate.js");
const fetchReactions = require("../modules/fetchMessageReactions.js");

const validEmojis = ['⭐', '👍', 'purple_heart_beating'];
var startDate = Math.floor(new Date().setHours(20, 0, 0) / 1000);
var endDate = Math.floor(new Date().setHours(23, 5, 0) / 1000);
// startDate -= 60 * 60 * 24 * 12;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sally")
        .setDescription("Testing version 2 of the tally command.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.deferReply({ content: "Processing...", ephemeral: true });
        const messages = await fetchMessages.execute(startDate, endDate, interaction);
        await interaction.editReply({ content: `Messages fetched: ${messages.length}`, ephemeral: true });

        messages.forEach(async message => {
            const reactions = await fetchReactions.execute(message);
            // var filteredReactions = reactions.filter(reaction => validEmojis.includes(reaction.emoji));
            // console.log(filteredReactions);
            console.log(reactions);
        });
    },
};
