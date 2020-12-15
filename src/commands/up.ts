// packages
import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";

// utils
import { boilerplateExists, commandExists, print, printError } from "../utils";
import {
  commandVariables,
  localAndGlobalArgs,
  userProvidedArgs,
  generateBoilerplate,
  dirExists,
} from "./up.spec";
import { commandArgsTable } from "../utils";

// types
import { Arg, ArgsObject } from "../types/args";

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

  static examples = [
    `$ boil up component ${print("--name")} App ${print("--filetype")} js`,
    `$ boil up component ${print("-n")} App ${print("-ft")} js

run ${print("boil list")} to see all available boilerplate template commands`,
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
      If some args are still missing, or the user picks a value not in the arg options array, then throw an error and show the command help prompt
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

    // match user input args to defined args
    const requiredArgs: ArgsObject = variables.reduce(
      (obj, arg) => ({ ...obj, [arg]: { ...definedArgs[arg], name: arg } }),
      {}
    );

    // check that the required args have been provided by the user (either by the full name or the shorthand method)
    const matchRequiredToUserInputs = Object.values(requiredArgs).map(
      (requiredArg) =>
        Object.keys(userArgs).reduce((output, userArg) => {
          const value = userArgs[userArg];
          const [nameRegex, shorthandRegex] = [
            userArg.match(/(?<=--).*/g),
            userArg.match(/(?<=-).*/g),
          ];
          const userObj = {
            name: nameRegex && nameRegex[0],
            shorthand: !nameRegex && shorthandRegex![0],
          };
          const nameMatch = requiredArg.name === userObj.name;
          const shorthandMatch = requiredArg.shorthand === userObj.shorthand;
          if (nameMatch || shorthandMatch) return { ...requiredArg, value };
          return output;
        }, {})
    );

    // if a user hasn't provided all args then check if any of the required args have default values.
    // also, if the arg has an options array check the input value is a valid option
    const validatedArgs = matchRequiredToUserInputs.map((args, idx) => {
      let output: Arg = args;
      const hasArgs = Object.keys(output).length > 0;
      if (!hasArgs) {
        const requiredArg = Object.values(requiredArgs)[idx];
        output = { ...requiredArg, value: requiredArg.default };
      }
      const validInputAgainstOptions = output.options
        ? !!output.options.find((option) => option === output.value)
        : !!output.value; // if the value is undefined then this variable will be false
      return { ...output, valid: validInputAgainstOptions };
    });

    const notAllValid = validatedArgs.some((arg) => !arg.valid);

    if (notAllValid) {
      this.log(printError(`your args don't match the command requirements`));
      commandArgsTable(Object.values(requiredArgs), "up", command);
      return;
    }

    // 6. Prompt the user where to save the boilerplate files and/or folders (and verify the directory exists)
    const { source }: Prompt = await inquirer.prompt([
      {
        name: "source",
        message:
          "where would you like to save the boilerplate files and/or folders?",
        type: "input",
        default: "./",
      },
    ]);

    // if source is missing root ('./...') then add it
    const formattedSource =
      source.slice(0, 2) === "./" ? source : `./${source}`;

    if (!dirExists(formattedSource)) {
      return this.log(printError(`'${formattedSource}' does not exist`));
    }

    // 7. generate the files and folders, switching out all the arg placeholders with the user-provided values
    const argInputs = validatedArgs.reduce(
      (output, { name, value }) => ({ ...output, [name!]: value }),
      {}
    );

    generateBoilerplate(command, formattedSource, argInputs);
  }
}
