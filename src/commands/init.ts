// packages
import { mkdirSync, writeFileSync } from "fs";
import { Command, flags } from "@oclif/command";

// utils
import { print, printError, emojis, boilerplateExists } from "../utils";

// constants
import {
  globalYaml,
  localYaml,
  placeholderContent,
  templateFunctionContent,
  readmeContent,
  BEGIN_ESCAPE,
  END_ESCAPE,
} from "./init.spec";

const rootPath = "./.boilerplate";

const generateFilesAndFolders = () => {
  // create .boilerplate folder
  mkdirSync(rootPath);
  // create readme
  writeFileSync(`${rootPath}/readme.txt`, readmeContent);
  // create global args yml file
  writeFileSync(`${rootPath}/global.args.yml`, globalYaml);
  // create template function
  writeFileSync(`${rootPath}/timestamp.js`, templateFunctionContent);
  // create component directory (example template out-of-the-box)
  mkdirSync(`${rootPath}/component`);
  // create local args yml file
  writeFileSync(`${rootPath}/component/local.args.yml`, localYaml);
  // folder with template arg name
  mkdirSync(`${rootPath}/component/${BEGIN_ESCAPE} name ${END_ESCAPE}`);
  // file with template arg name and filetype
  writeFileSync(
    `${rootPath}/component/${BEGIN_ESCAPE} name ${END_ESCAPE}/${BEGIN_ESCAPE} name ${END_ESCAPE}.${BEGIN_ESCAPE} filetype ${END_ESCAPE}`,
    placeholderContent
  );
};

export default class Init extends Command {
  static description = "create a new boilerplate directory";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    if (boilerplateExists()) {
      this.log(
        printError(`looks like you already have a '.boilerplate' folder`)
      );
    } else {
      generateFilesAndFolders();
      this.log(
        `${emojis([":tropical_drink:", ":dancer:"])} ${print(
          `'.boilerplate' folder has been created in the root of the current directory`
        )}`
      );
    }
  }
}
