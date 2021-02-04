// packages
import { existsSync } from "fs";

export const boilerplateExists = () => {
  return existsSync(`./.boilerplate`);
};

export const templateExists = (template: string) => {
  return existsSync(`./.boilerplate/${template}`);
};
