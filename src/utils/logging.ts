// packages
import chalk from "chalk";
import { get } from "node-emoji";

/*
common app emojis (recommended): http://www.emoji-cheat-sheet.com/
package emojis: https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
*/
export const emoji = (type: string) => get(type);

// print a message to the terminal in color
export const print = (msg: string, color = "green") => {
  return chalk.keyword(color)(msg);
};

export const printError = (msg: string) => {
  return `${emoji(":no_entry:")} ${print(msg, "red")}`;
};

// bold message
export const bold = (msg: string) => chalk.bold(msg);

// used to output a string of multiple emojis
export const emojis = (arr: string[]) => {
  return arr.reduce((output, currentEmoji) => {
    return (output += emoji(currentEmoji));
  }, "");
};
