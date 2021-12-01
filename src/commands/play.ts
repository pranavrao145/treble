import { Collection, Message, MessageEmbed } from "discord.js";
import { ICommand, ISong } from "../utils/types";

const command: ICommand = {
    name: "help",
    description: "Adds a song to the queue given a song name or URL.",
    alias: ["p"],
    syntax: "-play (song name/url)",
    async execute(
        message: Message,
        masterQueue: Collection<string, ISong[]>,
        args?: string[]
    ) {
        console.log(
            `Command play started by user ${message.member!.user.tag} in guild ${
                message.guild!.name
            }.`
        );

        const outputEmbed = new MessageEmbed() // create an embed to display the results of the command
        .setColor("#97572B")
        .setTitle("Play");

        // check if the member is actually in a voice channel
        if (
            !message.member?.voice.channel ||
        message.member.voice.channel.type === "GUILD_STAGE_VOICE"
        ) {
            try {
                console.log("Voice member not in a voice channel. Stopping execution.");
                return await message.channel.send(
                    "You must be in a voice channel to use this command."
                );
            } catch (e) {
                console.log(
                    `There was an error sending a message in the guild ${
                        message.guild!.name
                    }! The error message is below:`
                );
                console.log(e);
                return;
            }
        }

        if (!args || args.length === 0 || args.length > 1) {
            // check if the args exist (this function requires them) and that there are not too many args
            try {
                console.log("Incorrect syntax given. Stopping execution.");
                return await message.channel.send(
                    `Incorrect syntax. Correct syntax: \`${this.syntax}\``
                );
            } catch (e) {
                console.log(
                    `There was an error sending a message in the guild ${
                        message.guild!.name
                    }! The error message is below:`
                );
                console.log(e);
                return;
            }
        }
    },
};
