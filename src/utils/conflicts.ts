// packages
import { readdirSync } from "fs";

export const boilerplateExists = () => {
  return readdirSync("./").some((dir) => dir === ".boilerplate");
};

export const commandExists = (command: string) => {
  return readdirSync("./.boilerplate").some((dir) => dir === command);
};
