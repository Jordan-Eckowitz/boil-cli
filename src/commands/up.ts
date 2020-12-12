// packages
import { Command, flags } from "@oclif/command";
import { chunk, fromPairs } from "lodash";
import pipe from "lodash/fp/pipe";

// utils
import { boilerplateExists, commandExists, printError } from "../utils";
import { commandVariables } from "./up.spec";

export default class Up extends Command {
  static description = "run one of your boilerplate template commands";

  static strict = false; // allow any user inputs

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "command",
      required: true,
      description: `call up a template command defined in the '.boilerplate' directory`,
    },
  ];

  async run() {
    const { args } = this.parse(Up);
    const { command } = args;
    const inputs = process.argv;
    const commandIndex = inputs.indexOf(command);
    const inputsAfterCommand = inputs.slice(commandIndex + 1);
    const pairs = pipe(chunk, fromPairs)(inputsAfterCommand, 2);

    // 1. check that '.boilerplate' directory exists
    if (!boilerplateExists()) {
      return this.error(
        printError(
          `looks like you don't have a '.boilerplate' directory - run 'boil init' to start a new project`
        )
      );
    }

    // 2. If there's no command directory matching the user command then throw an error
    if (!commandExists(command)) {
      return this.error(
        printError(
          `looks like there isn't a command called '${command}' in the '.boilerplate' directory`
        )
      );
    }

    // 3. Extract all template variables (||*||) from the command directory
    commandVariables(command);
    console.log(pairs);
  }
}