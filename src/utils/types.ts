import { Message } from "discord.js";

// interface for a bot command
export interface ICommand {
  name: string;
  description: string;
  alias?: string[];
  syntax: string;
  execute(...args: [message: Message, args?: string[]]): any;
}
