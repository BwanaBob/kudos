const {
  SlashCommandBuilder,
  PermissionFlagsBits, EmbedBuilder
} = require("discord.js");


async function getStarCount(startDate, endDate, interaction) {
  // const afterDate = new Date();
  let starStats = {
    "startDate": startDate,
    "endDate": endDate,
    "messagesEligible": 0,
    "stars": 0,
    "starred": 0,
    "messagesRetrieved": 0,
    "messages": [],
    "users": []
  };
  let lastId;
  let startDateReached = false;
  let messagesFetched = 0;
  while (!startDateReached) {
    const messages = await interaction.channel.messages.fetch({ limit: 20, before: lastId });
    messagesFetched += messages.size;
    starStats.messagesRetrieved = messagesFetched;
    lastId = messages.last().id;
    messages.forEach((message) => {
      // console.log(message);
      // console.log(`Created: ${message.createdTimestamp / 1000} End: ${endDate} good: ${message.createdTimestamp/1000 < endDate}:${message.createdTimestamp/1000 > startDate}`);
      if (message.createdTimestamp / 1000 > endDate) { return; }
      if (message.createdTimestamp / 1000 < startDate) { startDateReached = true; return; }
      starStats.messagesEligible += 1;
      const starCount = message.reactions.cache.get('⭐')?.count ?? 0;
      if (starCount > 0) {
        starStats.stars += starCount;
        starStats.starred += 1;
        starStats.messages.push({"id": message.id, "stars" : starCount});
        if(message.author.id in starStats.users){
          starStats.users[message.author.id] += starCount;
        } else {
          starStats.users[message.author.id] = starCount;
        }
      };
    })
    if (messages.size != 20 || messagesFetched >= 100) {
      // sleep(10000);
      break;
    }
  }
  return starStats;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tally")
    .setDescription("Fetch reactions for the past hour from this channel and report.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    var startDate = Math.floor(new Date().setHours(20, 0, 0) / 1000);
    var endDate = Math.floor(new Date().setHours(23, 5, 0) / 1000);
    // var startDate = Math.floor(new Date().setHours(2, 0, 0) / 1000);
    // var endDate = Math.floor(new Date().setHours(23, 5, 0) / 1000);
    startDate -= 60 * 60 * 24;

    if (endDate > Math.floor(new Date() / 1000)) {
      endDate -= 60 * 60 * 24;
      startDate -= 60 * 60 * 24;
    }
    const starStats = await getStarCount(startDate, endDate, interaction);
    // const topPosts = starStats.messages.sort()
    const serverEmbed = new EmbedBuilder()
      .setColor(0x55e6d4)
      .setTitle("Star Tally")
      .addFields({
        name: "Date",
        value: `<t:${starStats.startDate}:d>`,
        inline: true,
      })
      .addFields({
        name: "Start",
        value: `<t:${starStats.startDate}:t>`,
        inline: true,
      },{
        name: "End",
        value: `<t:${starStats.endDate}:t>`,
        inline: true,
      },{
        name: "Messages",
        value: `${starStats.messagesEligible}`,
        inline: true,
      },{
        name: "Retrieved",
        value: `${starStats.messagesRetrieved}`,
        inline: true,
      })
      // .addFields({ name: '\u200b', value: '\u200b' })
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
    // console.log(starStats);
  },
};
