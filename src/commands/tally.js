const {
  SlashCommandBuilder,
  PermissionFlagsBits, EmbedBuilder
} = require("discord.js");


async function getStarCount(startDate, endDate, interaction) {
  // const afterDate = new Date();
  let starStats = {
    "startDate": startDate,
    "endDate": endDate,
    "messages": 0,
    "stars": 0,
    "starred": 0
  };
  const messages = await interaction.channel.messages.fetch({ limit: 20 });
  starStats.messages += messages.size;
  messages.forEach((message) => {
    // console.log(message.content);
    const starCount = message.reactions.cache.get('⭐')?.count ?? 0;
    if (starCount > 0) {
      starStats.stars += starCount;
      starStats.starred += 1;
      // console.log(starCount);
    };
  })
  return starStats;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tally")
    .setDescription("Fetch reactions for the past hour from this channel and report.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    // const startDate = new Date();
    const startDate = new Date( Date.now() - 1000 * 60 * 60 * 2 );
    const endDate = new Date();
    const starStats = await getStarCount(startDate, endDate, interaction);

    const serverEmbed = new EmbedBuilder()
      .setColor(0x55e6d4)
      .setTitle("Star Tally")
      .addFields({
        name: "Start",
        value: `${starStats.startDate}`,
        inline: true,
      })
      .addFields({
        name: "End",
        value: `${starStats.endDate}`,
        inline: true,
      })
      .addFields({
        name: "Messages",
        value: `${starStats.messages}`,
        inline: false,
      })
      .addFields({
        name: "Starred Messages",
        value: `${starStats.starred}`,
        inline: true,
      })
      .addFields({
        name: "Total Stars",
        value: `${starStats.stars}`,
        inline: true,
      })
      .setTimestamp()
      // .setThumbnail(interaction.guild.iconURL())
      // .setFooter({ text: `Established: ${interaction.guild.createdAt}` });

    await interaction.reply({ embeds: [serverEmbed], ephemeral: true });
  },
};
