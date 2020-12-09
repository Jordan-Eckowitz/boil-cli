// packages
import chalk from "chalk";
import { get } from "node-emoji";

// print a message to the terminal in color
export const print = (msg: string, color: string = "green") => {
  return chalk.keyword(color)(msg);
};

/*
common app emojis (recommended): http://www.emoji-cheat-sheet.com/
package emojis: https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
*/
export const emoji = (type: string) => get(type);

// used to output a string of multiple emojis
export const emojis = (arr: string[] = []) => {
  return arr.reduce((output, currentEmoji) => {
    return (output += emoji(currentEmoji));
  }, "");
};
