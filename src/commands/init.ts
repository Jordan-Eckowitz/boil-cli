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
} from "./init.spec";

const rootPath = "./.boilerplate";

const generateFilesAndFolders = () => {
  // create .boilerplate folder
  mkdirSync(rootPath);
  // create readme
  writeFileSync(`${rootPath}/readme.txt`, readmeContent);
  // create global args yml file
  writeFileSync(`${rootPath}/global.args.yml`, globalYaml());
  // create template function
  writeFileSync(`${rootPath}/timestamp.js`, templateFunctionContent());
  // create component directory (example template out-of-the-box)
  mkdirSync(`${rootPath}/component`);
  // create local args yml file
  writeFileSync(`${rootPath}/component/local.args.yml`, localYaml);
  // folder with template arg name
  mkdirSync(`${rootPath}/component/${global.BEGIN_SEQ} name ${global.END_SEQ}`);
  // file with template arg name and filetype
  writeFileSync(
    `${rootPath}/component/${global.BEGIN_SEQ} name ${global.END_SEQ}/${global.BEGIN_SEQ} name ${global.END_SEQ}.${global.BEGIN_SEQ} filetype ${global.END_SEQ}`,
    placeholderContent()
  );
};

export default class Init extends Command {
  static description = "create a new boilerplate directory";

  static flags = {
    help: flags.help({ char: "h" }),
    $begin: flags.string({
      default: global.BEGIN_SEQ,
      char: "b",
      required: false,
      description:
        "Character sequence used to mark the beginning of a template parameter",
    }),
    $end: flags.string({
      default: global.END_SEQ,
      char: "e",
      required: false,
      description:
        "Character sequence used to mark the end of a template parameter",
    }),
  };

  async run() {
    const { flags } = this.parse(Init);
    const { $begin, $end } = flags;

    global.BEGIN_SEQ = $begin;
    global.END_SEQ = $end;

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
