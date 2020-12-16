import { Command, flags } from "@oclif/command";

// utils
import { print, printError } from "../utils";

export default class Create extends Command {
  static description = "create a new boilerplate template";

  static flags = {
    help: flags.help({ char: "h" }),
    variables: flags.string({
      char: "v",
      description: "local template variables",
    }),
  };

  static args = [{ name: "name", description: "template name" }];

  static examples = [
    `$ boil create ${print("person", "blue")} ${print(
      "--variables"
    )} name,surname,age`,
    `$ boil create ${print("person", "blue")} ${print("-v")} name,surname,age`,
  ];

  async run() {
    const { args, flags } = this.parse(Create);

    if (!args.name) {
      this.log(printError(`you need to provide a template name`));
      this.log(`\nrun 'boil create ${print("--help")}' for details`);
      return;
    }

    console.log(`args: ${JSON.stringify(args)}`);
    console.log(`flags: ${JSON.stringify(flags)}`);
  }
}