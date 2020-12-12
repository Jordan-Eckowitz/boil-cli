// packages
import { existsSync } from "fs";

export const boilerplateExists = () => {
  return existsSync(`./.boilerplate`);
};

export const commandExists = (command: string) => {
  return existsSync(`./.boilerplate/${command}`);
};
