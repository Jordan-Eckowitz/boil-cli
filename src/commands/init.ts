// packages
import { mkdirSync, readdirSync, writeFileSync } from "fs";
import { Command, flags } from "@oclif/command";

// utils
import { print, emoji, emojis } from "../utils";

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
  mkdirSync(`${rootPath}/component/|| name ||`);
  // file with template variable name and type
  writeFileSync(
    `${rootPath}/component/|| name ||/|| name ||.|| type ||`,
    placeholderContent
  );
};

export default class Init extends Command {
  static description = "create a new boilerplate directory";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    const boilerplateExists = readdirSync("./").some(
      (dir) => dir === ".boilerplate"
    );

    if (boilerplateExists) {
      this.error(
        `${emoji(":unamused:")} ${print(
          `looks like you already have a '.boilerplate' folder`,
          "red"
        )}`
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
