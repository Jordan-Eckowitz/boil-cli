// packages
import { Command, flags } from "@oclif/command";
import { readdirSync, lstatSync } from "fs";

// utils
import { print, printError, bold, boilerplateExists } from "../utils";

const root = "./.boilerplate";

export default class List extends Command {
  static description = "list all boil commands";

  static flags = { help: flags.help({ char: "h" }) };

  async run() {
    // 1. check that '.boilerplate' directory exists
    if (!boilerplateExists()) {
      return this.log(
        printError(
          `looks like you don't have a '.boilerplate' directory - run 'boil init' to start a new project`
        )
      );
    }

    // extract folder names from '.boilerplate' directory
    const commands = readdirSync(root).filter((src) =>
      lstatSync(`${root}/${src}`).isDirectory()
    );

    // 2. if no commands in boilerplate directory then prompt the user to create one
    if (commands.length === 0) {
      return this.log(
        printError(
          `looks like you haven't created any commands yet - run 'boil create --help' for more information`
        )
      );
    }

    // 3. list all commands
    this.log(`\n${bold("COMMANDS")}`);
    commands.map((cmd) => this.log(`  boil up ${print(cmd, "blue")}`));
    this.log(`\n${bold("OPTIONS")}`);
    this.log(`  -h, --help ${print("show CLI help", "gray")}`);
  }
}
