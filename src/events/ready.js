const { Events, ActivityType } = require("discord.js");
const fs = require("node:fs");
// const path = require("node:path");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    var startDate = new Date();
    console.log(
      `[${startDate.toLocaleString().padEnd(23)}] 🤖 START | Bot Logged In | ${client.user.username} (${client.user.tag})`
    );

    client.guilds.cache.forEach((guild) => {
      console.log(`[${startDate.toLocaleString().padEnd(23)}] 🖥️  GUILD | Guild Joined  | ${guild.name} (${guild.memberCount})`);
    });

    // //jobs handler
    // const jobsPath = path.join(__dirname, "../jobs");
    // const jobsFiles = fs
    //   .readdirSync(jobsPath)
    //   .filter((file) => file.endsWith(".js"));
    // for (const file of jobsFiles) {
    //   const filePath = path.join(jobsPath, file);
    //   const job = require(filePath);
    //   job.execute(client);
    // }

    client.user.setPresence({
      status: "online",
      activities: [
        {
          type: ActivityType.Watching,
          name: "your reactions",
        },
      ],
    });
  },
};
