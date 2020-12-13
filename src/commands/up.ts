// packages
import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";

// utils
import { boilerplateExists, commandExists, print, printError } from "../utils";
import {
  commandVariables,
  localAndGlobalArgs,
  userProvidedArgs,
} from "./up.spec";
import { commandArgsTable } from "../utils";

// types
import { ArgsObject } from "../types/args";

interface Prompt {
  source: string;
}

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

    // 1. check that '.boilerplate' directory exists
    if (!boilerplateExists()) {
      return this.log(
        printError(
          `looks like you don't have a '.boilerplate' directory - run 'boil init' to start a new project`
        )
      );
    }

    // 2. If there's no command directory matching the user command then throw an error
    if (!commandExists(command)) {
      return this.log(
        printError(
          `looks like there isn't a command called '${command}' in the '.boilerplate' directory`
        )
      );
    }

    // 3. Extract all template variables (<|*|>) from the command directory
    const variables = commandVariables(command);

    // 4. Check the local args and global args to see if all template variables are defined - if some are not then prompt the user which are missing and throw an error
    const definedArgs: ArgsObject = localAndGlobalArgs(command);
    const undefinedArgs = variables.filter(
      (variable) => !Object.keys(definedArgs).includes(variable)
    );
    if (undefinedArgs.length > 0) {
      this.log(
        printError(
          `looks like your command has template variables that haven't been defined \n\nplease define the args below in either global.args.yml or local.args.yml `
        )
      );
      undefinedArgs.forEach((arg) => this.log(print(`  - ${arg}`, "red")));
      return;
    }

    /* 5. If all template variables have been defined then check if the user has provided all the args. 
      If some are missing then first check if the args have default values.
      If some args are still missing then throw an error and show the command help prompt
    */
    const userArgs = userProvidedArgs(command);

    // check that user flags begin with either -- or -
    const invalidFlags = Object.keys(userArgs).some(
      (arg) => !arg.match(/^--/g) && !arg.match(/^-/g)
    );
    if (invalidFlags) {
      return this.log(
        printError(
          `all your arg flags should begin with --(name) or -(shorthand)`
        )
      );
    }

    // match user flags to defined args - if some don't match then throw an error
    const requiredArgs: ArgsObject = variables.reduce(
      (obj, arg) => ({ ...obj, [arg]: { ...definedArgs[arg], name: arg } }),
      {}
    );

    /*
      first check if the variable name exists in the required args object
      if it doesn't exist then set the nameMatch to the shorthand
      if there isn't a shorthand then set nameMatch to the default value
      if there still isn't a match then throw an error (user needs to adjust input args)
    */
    const invalidUserInputs = Object.keys(userArgs).some((arg) => {
      const extractName = arg.match(/(?<=--).*/g) || arg.match(/(?<=-).*/g);
      const variableName = extractName![0];
      const nameMatch =
        requiredArgs[variableName] ||
        Object.values(requiredArgs).find(
          (arg) => arg.shorthand === variableName || arg.default
        );
      return !nameMatch;
    });

    if (invalidUserInputs) {
      this.log(printError(`your args don't match the command requirements`));
      commandArgsTable(Object.values(requiredArgs), "up", command);
      return;
    }

    // TODO: 6. If an arg has fixed options then determine if the user input is valid

    // 7. Prompt the user where to save the boilerplate files and/or folders
    const { source }: Prompt = await inquirer.prompt([
      {
        name: "source",
        message:
          "where would you like to save the boilerplate files and/or folders?",
        type: "input",
        default: "./src",
      },
    ]);
    console.log(source);
  }
}
