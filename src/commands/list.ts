// packages
import { Command, flags } from "@oclif/command";
import { readdirSync, lstatSync } from "fs";

const root = "./.boilerplate";

export default class List extends Command {
  static description = "list all boil commands";

  static flags = { help: flags.help({ char: "h" }) };

  async run() {
    // extract folder names from '.boilerplate' directory
    const commands = readdirSync(root).filter((src) =>
      lstatSync(`${root}/${src}`).isDirectory()
    );

    this.log(commands);
  }
}
