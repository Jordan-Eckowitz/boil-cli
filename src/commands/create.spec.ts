// packages
import { existsSync, mkdirSync, writeFileSync } from "fs";

const rootPath = "./.boilerplate";

export const templateExists = (name: string) => {
  return existsSync(`${rootPath}/${name}`);
};

export const generateTemplate = (name: string, variables: string[]) => {
  const path = `${rootPath}/${name}`;
  mkdirSync(path);

  let ymlContent = variables.reduce((output, variable) => {
    const str = `# definition of '${variable}' variable
${variable}: # variable will be called using --${variable}
    # shorthand: x # variable can be called using -x instead of --${variable}
    description: ${variable} variable # used in help menu \n\n`;
    return output + str;
  }, "");

  if (ymlContent === "") ymlContent = `# add any local variable config here`;

  writeFileSync(`${path}/local.args.yml`, ymlContent);
};
