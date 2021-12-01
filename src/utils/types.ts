import { Collection, Message } from "discord.js";

// interface for a bot command
export interface ICommand {
  name: string;
  description: string;
  alias?: string[];
  syntax: string;
  execute(...args: [message: Message, masterQueue: Collection<string, ISong[]>, args?: string[]]): any;
}

export interface ISong {
    name: string;
    url: string;
}
