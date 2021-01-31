// packages
import {
  readdirSync,
  readFileSync,
  lstatSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import read from "read-data";
import { uniq, chunk, fromPairs, cloneDeep } from "lodash";
import pipe from "lodash/fp/pipe";

// utils
import { emoji } from "../utils";

// types
import { Arg, ArgsObject } from "../types";

interface SplitArgs {
  [key: string]: string[];
}

const extractVariable = (variable: string) => {
  return variable.match(/(?<=\<\|)(.*?)(?=\|\>)/g);
};

const replaceVariables = (
  content: string,
  varPlaceholderValues: { [key: string]: string } // e.g. {name: 'App', filetype: 'js'}
): string => {
  // remove whitespaces between '<|' and '|>' symbols, e.g. <|  WORD  |>  =>  <|WORD|>
  const whitespaceLeftOfWord = /(?<=\<\|)\s+(?=[^\W])/g; // '<|   WORD'
  const whitespaceRightOfWord = /(?<=[^\W])\s+(?=\|\>)/g; // 'WORD   |>'
  const contentWithoutWhitespaces = content
    .replace(whitespaceLeftOfWord, "")
    .replace(whitespaceRightOfWord, "");

  // replace variable placeholders with values
  const newContent = Object.keys(varPlaceholderValues).reduce(
    (output, arg): string => {
      return output.replace(`<|${arg}|>`, varPlaceholderValues[arg]);
    },
    contentWithoutWhitespaces
  );

  // 'replace' only finds the first match ('replaceAll' not yet supported)
  //  so, keep running this function recursively until no template variables remain
  if (extractVariable(newContent)) {
    return replaceVariables(newContent, varPlaceholderValues);
  }
  return newContent;
};

// regex looks for anything between triangles (<|*|>)
const extractVariablesArray = (variable: string) => {
  const templateVariable = extractVariable(variable);
  // trim whitespaces
  if (templateVariable) {
    return templateVariable.map((variable) => variable.trim());
  }
  return [];
};

export const commandVariables = (command: string) => {
  const rootPath = `./.boilerplate/${command}`;
  const variables: string[] = [];

  // recursively look for template variables (<|*|>) in directory names, file names and within files
  const variablesFromDirectoriesFilenamesFilecontent = (path: string) => {
    const directoriesAndFiles = readdirSync(path);
    directoriesAndFiles.forEach((dirOrFile) => {
      extractVariablesArray(dirOrFile).forEach((variable) => {
        variables.push(variable);
        const nestedFile = `${path}/${dirOrFile}`;
        // if a file then extract template variables from its contents
        if (lstatSync(nestedFile).isFile()) {
          const data = readFileSync(nestedFile, "utf8");
          extractVariablesArray(data).forEach((variable) =>
            variables.push(variable)
          );
        }
      });
      // if nested directories exist then recursively look for template variables at that path
      const nestedPath = `${path}/${dirOrFile}`;
      if (lstatSync(nestedPath).isDirectory()) {
        const nestedDirectories = readdirSync(nestedPath);
        if (nestedDirectories) {
          variablesFromDirectoriesFilenamesFilecontent(nestedPath);
        }
      }
    });
  };

  // start looking for variables in the command root path
  variablesFromDirectoriesFilenamesFilecontent(rootPath);

  // return array of unique variable names
  return uniq(variables);
};

export const localAndGlobalArgs = (command: string) => {
  const rootPath = `./.boilerplate`;
  let args = {};

  const getArgs = (path: string) => {
    if (existsSync(path)) {
      const argsObject = read.sync(path) || {};
      args = { ...args, ...argsObject };
    }
  };

  const globalPath = `${rootPath}/global.args.yml`;
  const localPath = `${rootPath}/${command}/local.args.yml`;
  getArgs(globalPath);
  getArgs(localPath);
  return args;
};

export const userProvidedArgs = (command: string) => {
  const inputs = process.argv;
  const commandIndex = inputs.indexOf(command);
  const inputsAfterCommand = inputs.slice(commandIndex + 1);
  return pipe(chunk, fromPairs)(inputsAfterCommand, 2);
};

export const compareUserRequiredArgs = (
  requiredArgs: object,
  userArgs: { [key: string]: string }
) =>
  Object.values(requiredArgs).map((requiredArg) =>
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

export const validateArgs = (comparedArgs: Arg[], requiredArgs: ArgsObject) => {
  return comparedArgs.map((args, idx) => {
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
};

export const dirExists = (path: string) => existsSync(path);

export const generateBoilerplate = (
  command: string,
  source: string,
  args: { [key: string]: string }
) => {
  const rootPath = `./.boilerplate/${command}`;
  const withValues = (str: string) => replaceVariables(str, args);

  const makeFilesFolders = (path: string) => {
    const directoriesAndFiles = readdirSync(path);
    directoriesAndFiles.forEach((dirOrFile) => {
      if (dirOrFile !== "local.args.yml") {
        const nestedPath = `${path}/${dirOrFile}`;
        const stats = lstatSync(nestedPath);
        const [isFile, isDirectory] = [stats.isFile(), stats.isDirectory()];
        const writePath = withValues(nestedPath.replace(rootPath, source));
        const successMsg = () => {
          return console.log(
            `${emoji(":white_check_mark:")} writing: ${writePath}`
          );
        };
        const failMsg = () => {
          return console.log(
            `${emoji(":no_entry:")} '${writePath}' already exists`
          );
        };

        // if directory then replace any variables in folder name with value
        // also, recursively callback 'makeFilesFolders' to look for any nested files/folders
        if (isDirectory) {
          if (existsSync(writePath)) {
            failMsg();
          } else {
            mkdirSync(writePath);
            makeFilesFolders(nestedPath);
            successMsg();
          }
        }

        // if file then replace any variables in file name with value
        // also, write the file contents (also replacing any variables with values)
        if (isFile) {
          if (existsSync(writePath)) {
            failMsg();
          } else {
            const data = withValues(readFileSync(nestedPath, "utf8"));
            writeFileSync(writePath, data);
            successMsg();
          }
        }
      }
    });
  };
  makeFilesFolders(rootPath);
};

const containsBrackets = (arg: string) => arg.match(/\(.*?\)/);

export const splitArgs = (variables: string[]) => {
  return variables.reduce(
    (args: SplitArgs, arg) => {
      const output = cloneDeep(args);
      if (containsBrackets(arg)) {
        output.functionalArgs.push(arg);
      } else {
        output.templateArgs.push(arg);
      }
      return output;
    },
    { templateArgs: [], functionalArgs: [] }
  );
};

const extractFunctionName = (fn: string) => {
  const bracket = containsBrackets(fn);
  const bracketIndex = bracket!.index!;
  return fn.slice(0, bracketIndex);
};

export const undefinedFunctions = (args: string[]) => {
  const root = readdirSync("./.boilerplate");
  const missingFunctions = args.filter((arg) => {
    return !root.find((file) => file === `${extractFunctionName(arg)}.js`);
  });
  return missingFunctions.map((fn) => `${extractFunctionName(fn)}.js`);
};

export const extractFunctionInputArgs = (functions: string[]) => {
  const inputArgs = functions
    .map((fn) =>
      fn
        .replace(extractFunctionName(fn), "") // remove function name
        .slice(1, -1) // remove enclosing () brackets
        .split(",")
        .map((fn) => fn.trim())
    )
    .flat();
  return uniq(inputArgs);
};
