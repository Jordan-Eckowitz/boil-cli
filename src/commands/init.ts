// packages
import { mkdirSync, writeFileSync } from "fs";
import { Command, flags } from "@oclif/command";

// utils
import { print, printError, emojis, boilerplateExists } from "../utils";

// constants
import { globalYaml, localYaml, placeholderContent } from "./init.spec";

const rootPath = "./.boilerplate";

const generateFilesAndFolders = () => {
  // create .boilerplate folder
  mkdirSync(rootPath);
  // create global args yml file
  writeFileSync(`${rootPath}/global.args.yml`, globalYaml);
  // create component directory (example template out-of-the-box)
  mkdirSync(`${rootPath}/component`);
  // create local args yml file
  writeFileSync(`${rootPath}/component/local.args.yml`, localYaml);
  // folder with template variable name
  mkdirSync(`${rootPath}/component/<| name |>`);
  // file with template variable name and filetype
  writeFileSync(
    `${rootPath}/component/<| name |>/<| name |>.<| filetype |>`,
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
