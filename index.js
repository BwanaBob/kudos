require("dotenv").config();

const {
    Client,
    Collection,
    GatewayIntentBits,
  } = require("discord.js");
  
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers
    ],
  });

const options = require("./options.json"); // start replacing .env variables and client.params with this
console.log(options.welcomeMessage);


client.login(process.env.DISCORD_TOKEN);
