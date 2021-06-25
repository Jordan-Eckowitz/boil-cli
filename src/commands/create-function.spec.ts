// packages
import { existsSync, writeFileSync } from "fs";

// utils
import { emoji } from "../utils";
import { BEGIN_ESCAPE, END_ESCAPE } from "./init.spec";

const rootPath = "./.boilerplate";

export const templateExists = (name: string) => {
  return existsSync(`${rootPath}/${name}.js`);
};

const successMsg = (msg: string) => {
  return console.log(`${emoji(":white_check_mark:")} writing: ${msg}`);
};

export const generateTemplateFunction = (name: string) => {
  const content = `// usage in templates: ${BEGIN_ESCAPE} ${name}(arg1, arg2, ...) ${END_ESCAPE}
module.exports = function (/* any args incl. local & global template args */) {
  // insert code here
};
`;

  const path = `${rootPath}/${name}.js`;
  writeFileSync(path, content);
  successMsg(path);
};
