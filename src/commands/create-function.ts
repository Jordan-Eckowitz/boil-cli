import { Command, flags } from "@oclif/command";

// utils
import { print, printError, boilerplateExists } from "../utils";
import {
  templateExists,
  generateTemplateFunction,
} from "./create-function.spec";

export default class Create extends Command {
  static description = "create a new boilerplate template function";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "name", description: "template function name" }];

  static examples = [`$ boil create-function ${print("timestamp", "blue")}`];

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
      this.log(printError(`you need to provide a template function name`));
      this.log(`\nrun 'boil create-function ${print("--help")}' for details`);
      return;
    }

    // 3. validate the template function name doesn't exist yet
    if (templateExists(name)) {
      return this.log(
        printError(`template function '${name}.js' already exists`)
      );
    }

    // 4. generate template function
    generateTemplateFunction(name);
  }
}
