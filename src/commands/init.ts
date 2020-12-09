// packages
import { mkdirSync, readdirSync } from "fs";
import { Command, flags } from "@oclif/command";

// utils
import { print, emoji, emojis } from "../utils";

export default class Init extends Command {
  static description = "create a new boilerplate directory";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    // force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    // const { args, flags } = this.parse(Init);

    const boilerplateExists = readdirSync("./").some(
      (dir) => dir === ".boilerplate"
    );

    if (boilerplateExists) {
      this.error(
        `${emoji(
          ":unamused:"
        )} looks like you already have a .boilerplate folder`
      );
    } else {
      mkdirSync("./.boilerplate");
      this.log(
        `\n${emojis([":tropical_drink:", ":dancer:"])} ${print(
          ".boilerplate folder has been created in the root of the current directory"
        )}\n`
      );
    }
  }
}
