import { Command, flags } from "@oclif/command";

// utils
import { print, printError, boilerplateExists } from "../utils";
import { templateExists, generateTemplate } from "./create.spec";

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
    const {
      args: { name },
      flags,
    } = this.parse(Create);

    // 1. check that '.boilerplate' directory exists
    if (!boilerplateExists()) {
      return this.log(
        printError(
          `looks like you don't have a '.boilerplate' directory - run 'boil init' to start a new project`
        )
      );
    }

    // 2. validate that the name argument has been provided
    if (!name) {
      this.log(printError(`you need to provide a template name`));
      this.log(`\nrun 'boil create ${print("--help")}' for details`);
      return;
    }

    // 3. validate the template name doesn't exist yet
    if (templateExists(name)) {
      return this.log(printError(`template '${name}' already exists`));
    }

    // 4. generate template
    const variables = flags.variables ? flags.variables.split(",") : [];
    generateTemplate(name, variables);

    console.log(`args: ${JSON.stringify(name)}`);
    console.log(`flags: ${JSON.stringify(flags)}`);
  }
}
