// packages
import { existsSync, mkdirSync, writeFileSync } from "fs";

// utils
import { emoji } from "../utils";

const rootPath = "./.boilerplate";

export const templateExists = (name: string) => {
  return existsSync(`${rootPath}/${name}`);
};

const successMsg = (msg: string) => {
  return console.log(`${emoji(":white_check_mark:")} writing: ${msg}`);
};

export const generateTemplate = (name: string, args: string[]) => {
  const path = `${rootPath}/${name}`;
  mkdirSync(path);
  successMsg(path);

  let ymlContent = args.reduce((output, arg) => {
    const str = `# definition of '${arg}' arg
${arg}: # arg will be called using --${arg}
    # shorthand: x # arg can be called using -x instead of --${arg}
    description: ${arg} # used in help menu \n\n`;
    return output + str;
  }, "");

  if (ymlContent === "") ymlContent = `# add any local arg config here`;

  const localPath = `${path}/local.args.yml`;
  writeFileSync(localPath, ymlContent);
  successMsg(localPath);
};
