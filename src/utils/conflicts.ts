// packages
import { readdirSync } from "fs";

export const boilerplateExists = () => {
  return readdirSync("./").some((dir) => dir === ".boilerplate");
};
