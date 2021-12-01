// set env
import * as dotenv from "dotenv";
dotenv.config();

// import all necessary modules
import Discord, { Collection } from "discord.js";
import { promisify } from "util";
import glob from "glob";
import { ICommand, ISong } from "./utils/types";

// initialize client object with all the necessary intents
const client: Discord.Client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const prefix = "-"; // declare prefix

// BOT PREP

// prepare to read command files
const globPromise = promisify(glob);
const commands: Array<ICommand> = [];
const masterQueue = new Collection<string, ISong[]>();

// load in command files
(async () => {
  const commandFiles = await globPromise(`${__dirname}/commands/**/*.{js,ts}`); // identify command files

  for (const file of commandFiles) {
    const command = await import(file);
    commands.push(command);
    console.log(`Command ${command.name} loaded successfully.`);
  }
})();

// BOT EVENTS

// on ready, set status and log presence data
client.on("ready", async () => {
  console.log(`Logged in as ${client.user!.tag}!`);
  console.log(`Currently in ${client.guilds.cache.size} guilds!`);

  try {
    client.user!.setPresence({
      status: "online",
      activities: [
        {
          name: "-help",
          type: "WATCHING",
        },
      ],
    });
  } catch (e) {
    console.log(
      "There was an error setting the bot status. The error message is below:"
    );
    console.log(e);
  }
});

// on a message, parse message for commands and execute accordingly
client.on("messageCreate", async (message: Discord.Message) => {
  // check if the message contains the prefix, and is not by a bot or in a dm
  if (
    !message.content.toLowerCase().startsWith(prefix) ||
    message.author.bot ||
    message.guild === null
  )
    return;

  if (!message.member || !message.guild) return; // check if the member that sent this message and its guild exists

  console.log(
    `Message received from user ${message.member.user.tag}. Checking for valid commands.`
  );

  // parse the message for the correct command and find the associated command file
  const [commandName, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  console.log(`Potential command name: ${commandName}`);
  console.log(`Potential arguments: ${args}`);

  const command = commands.find(
    (c) =>
      c.name === commandName ||
      (c.alias ? c.alias!.includes(commandName) : false)
  );

  // if the command is found, execute it
  if (command) {
    command.execute(message, masterQueue, args);
  } else {
    console.log("No command found, ignoring message.");
  }
});

// custom event for when a track stops
client.on('trackStop', () => {

})

// custom event for when the bot leaves the voice channel
client.on('voiceChannelLeave', () => {

})

// log in as bot
client.login(process.env.BOT_TOKEN).catch((err: any) => {
  throw err;
});

export default client;
