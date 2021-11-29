import { Message, MessageEmbed } from "discord.js";
import { promisify } from "util";
import glob from "glob";
import { ICommand } from "../utils/types";

const command: ICommand = {
  name: "help",
  description:
    "Displays a general help message, or for a specific command if specified.",
  alias: ["h"],
  syntax: "-help (command name)",
  async execute(message: Message, args?: string[]) {
    console.log(
      `Command help started by user ${message.member!.user.tag} in guild ${
        message.guild!.name
      }.`
    );

    const outputEmbed = new MessageEmbed() // create an embed to display the results of the command
      .setColor("#97572B")
      .setTitle("Help");

    // the way the program is written means there is no direct access to the client's commands, so they must be read again

    // prepare to read command files for different categories of commands
    const globPromise = promisify(glob);
    const allCommands: Array<ICommand> = [];

    const allCommandFiles = await globPromise(`${__dirname}/**/*.{js,ts}`); // identify command files

    for (const file of allCommandFiles) {
      const command = await import(file);
      allCommands.push(command);
    }

    if (args!.length > 0) {
      // if there are actually arguments found
      console.log(
        "Found argument supplied, attempting to find help for specific command."
      );

      const commandName = args!.shift(); // get the name of the command specified
      const command = allCommands.find(
        (c) =>
          c.name === commandName ||
          (c.alias ? c.alias!.includes(commandName!) : false)
      ); // attempt to find the command by name or alias

      if (command) {
        // if a command is found
        // extract info about the command
        const name = command.name;
        const aliases = command.alias;
        const syntax = command.syntax;
        const description = command.description;

        outputEmbed.setDescription(`**Command:** ${name}`); // add the command to the help message

        if (aliases) {
          // check if alias(es) exist for this command
          const aliasesFormatted = aliases.join(", "); // join the array of aliases by a comma for pretty printing in the embed
          outputEmbed.addField("Alias(es)", aliasesFormatted); // add alias info to output embed
        }

        // add other relevant info to output embed
        outputEmbed.addField("Syntax", syntax);
        outputEmbed.addField("Description", description);
      } else {
        // if command not found
        outputEmbed.addField("\u200B", "Invalid command, no help available.");
      }
      try {
        // send output embed with information about the command's success
        if (outputEmbed.fields.length > 0) {
          // check if there are actually any fields to send the embed with
          await message.channel.send({ embeds: [outputEmbed] });
        }
        console.log(
          `Command help, started by ${
            message.member!.user.tag
          }, terminated successfully in ${message.guild!.name}.`
        );
      } catch (e) {
        console.log(
          `There was an error sending an embed in the guild ${
            message.guild!.name
          }! The error message is below:`
        );
        console.log(e);
      }
    } else {
      // if the original message does not contain any arguments (general help message)
      outputEmbed.setDescription(
        "General Help\nUse the prefix **f!** before any of these commands\nFor information on a specific command, type f!help [command]"
      );

      let allOutputEmbedText = "";

      for (const command of allCommands) {
        allOutputEmbedText += `\`${command.name}\` `; // add the command to the output text with a space
      }

      if (allOutputEmbedText) {
        // check if there are actually commands to output
        outputEmbed.addField("Commands", allOutputEmbedText);
      }

      try {
        // send output embed with information about the command's success
        if (outputEmbed.fields.length > 0) {
          // check if there are actually any fields to send the embed with
          await message.channel.send({ embeds: [outputEmbed] });
        }
        console.log(
          `Command help, started by ${
            message.member!.user.tag
          }, terminated successfully in ${message.guild!.name}.`
        );
      } catch (e) {
        console.log(
          `There was an error sending an embed in the guild ${
            message.guild!.name
          }! The error message is below:`
        );
        console.log(e);
      }
    }
  },
};

export = command; // export the command to the main module
