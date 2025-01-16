// packages
import {
  readdirSync,
  readFileSync,
  lstatSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import path from "path";
import read from "read-data";
import { uniq, chunk, fromPairs, cloneDeep } from "lodash";
import pipe from "lodash/fp/pipe";

// utils
import { emoji } from "../utils";

// types
import { Arg, ArgsObject } from "../types";

interface Args {
  [key: string]: string;
}

interface SplitArgs {
  [key: string]: string[];
}

const extractArg = (arg: string) => {
  const placeholderRegex = /___([^_]+?)___/g;
  // trim to ensure whitespaces around the arg are removed
  return [...arg.matchAll(placeholderRegex)].map((match) => match[1]?.trim());
};

const containsBrackets = (arg: string) => arg.match(/\(.*?\)/);

const replaceArgs = (
  content: string,
  argPlaceholderValues: { [key: string]: string } // e.g. {name: 'App', filetype: 'js'}
): string => {
  // remove whitespaces only between '___' pairs, e.g. "___ WORD ___" => "___WORD___"
  const contentWithTrimmedPlaceholders = content.replace(
    /___\s*(.*?)\s*___/g,
    (_, group) => {
      return `___${group.replace(/\s+/g, "")}___`;
    }
  );

  // replace arg placeholders with values
  const newContent = Object.keys(argPlaceholderValues).reduce(
    (output, arg): string => {
      return output.replace(`___${arg}___`, argPlaceholderValues[arg]);
    },
    contentWithTrimmedPlaceholders
  );

  // 'replace' only finds the first match ('replaceAll' not yet supported)
  //  so, keep running this function recursively until no template args remain
  const extractedArgs = uniq(extractArg(newContent));
  if (extractedArgs.length > 0) {
    return replaceArgs(newContent, argPlaceholderValues);
  }
  return newContent;
};

// regex looks for anything between double underscores (___*___)
const extractArgsArray = (arg: string) => {
  const templateArg = extractArg(arg);
  // trim whitespaces
  if (templateArg) {
    return templateArg.map((arg) => arg.trim());
  }
  return [];
};

export const getTemplateArgs = (template: string) => {
  const rootPath = `./.boilerplate/${template}`;
  const args: string[] = [];

  // recursively look for template args (___*___) in directory names, file names and within files
  const argsFromDirectoriesFilenamesFileContent = (path: string) => {
    const directoriesAndFiles = readdirSync(path);
    directoriesAndFiles.forEach((dirOrFile) => {
      const nestedFile = `${path}/${dirOrFile}`;
      // if a file then extract template args from its contents
      if (lstatSync(nestedFile).isFile()) {
        const content = readFileSync(nestedFile, "utf8");
        extractArgsArray(content).forEach((arg) => args.push(arg));
      }
      // if a directory then extract template args from its name
      extractArgsArray(dirOrFile).forEach((arg) => {
        args.push(arg);
      });
      // if nested directories exist then recursively look for template args at that path
      const nestedPath = `${path}/${dirOrFile}`;
      if (lstatSync(nestedPath).isDirectory()) {
        const nestedDirectories = readdirSync(nestedPath);
        if (nestedDirectories) {
          argsFromDirectoriesFilenamesFileContent(nestedPath);
        }
      }
    });
  };

  // start looking for args in the template root path
  argsFromDirectoriesFilenamesFileContent(rootPath);

  // return array of unique arg names
  return uniq(args);
};

export const localAndGlobalArgs = (template: string) => {
  const rootPath = `./.boilerplate`;
  let args = {};

  const getArgs = (path: string) => {
    if (existsSync(path)) {
      const argsObject = read.sync(path) || {};
      args = { ...args, ...argsObject };
    }
  };

  const globalPath = `${rootPath}/global.args.yml`;
  const localPath = `${rootPath}/${template}/local.args.yml`;
  getArgs(globalPath);
  getArgs(localPath);
  return args;
};

export const userProvidedArgs = (template: string) => {
  const inputs = process.argv;
  const templateIndex = inputs.indexOf(template);
  const inputsAfterTemplate = inputs.slice(templateIndex + 1);
  return pipe(chunk, fromPairs)(inputsAfterTemplate, 2);
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
      : !!output.value; // if the value is undefined then this arg will be false
    return { ...output, valid: validInputAgainstOptions };
  });
};

export const dirExists = (path: string) => existsSync(path);

export const generateBoilerplate = (
  template: string,
  source: string,
  args: { [key: string]: string }
) => {
  const rootPath = `./.boilerplate/${template}`;
  const withValues = (str: string) => replaceArgs(str, args);

  const makeFilesFolders = (path: string) => {
    const directoriesAndFiles = readdirSync(path);
    directoriesAndFiles.forEach((dirOrFile) => {
      if (dirOrFile !== "local.args.yml") {
        const nestedPath = `${path}/${dirOrFile}`;
        const stats = lstatSync(nestedPath);
        const [isFile, isDirectory] = [stats.isFile(), stats.isDirectory()];
        const writePath = withValues(nestedPath.replace(rootPath, source));
        const formattedPath = writePath.replace("//", "/");
        const successMsg = () => {
          return console.log(
            `${emoji(":white_check_mark:")} writing: ${formattedPath}`
          );
        };
        const failMsg = () => {
          return console.log(
            `${emoji(":no_entry:")} '${formattedPath}' already exists`
          );
        };

        // if directory then replace any args in folder name with value
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

        // if file then replace any args in file name with value
        // also, write the file contents (also replacing any args with values)
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

export const splitArgs = (args: string[]) => {
  return args.reduce(
    (argsObject: SplitArgs, arg) => {
      const output = cloneDeep(argsObject);
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

const extractInputArgs = (fn: string) => {
  return fn
    .replace(extractFunctionName(fn), "") // remove function name
    .slice(1, -1) // remove enclosing () brackets
    .split(",")
    .map((fn) => fn.trim());
};

export const extractFunctionInputArgs = (functions: string[]) => {
  const inputArgs = functions
    .map((fn) => extractInputArgs(fn))
    .flat()
    .filter((arg) => arg.length > 0); // exclude empty strings (functions with no args)
  return uniq(inputArgs);
};

export const getFunctionValues = (functions: string[], args: Args) => {
  return functions.reduce((output, fn) => {
    const functionName = extractFunctionName(fn);
    const inputArgs = extractInputArgs(fn).map((val) => args[val]);

    const functionPath = path.relative(
      __dirname,
      `.boilerplate/${functionName}.js`
    );

    const templateFunction = require(functionPath);
    const result = templateFunction(...inputArgs);
    return { ...output, [fn]: result };
  }, {});
};
