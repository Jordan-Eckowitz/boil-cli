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
import { uniq, chunk, fromPairs } from "lodash";
import pipe from "lodash/fp/pipe";

import { emoji } from "../utils";

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
