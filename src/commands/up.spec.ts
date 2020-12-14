// packages
import { readdirSync, readFileSync, lstatSync, existsSync } from "fs";
import read from "read-data";
import { uniq, chunk, fromPairs } from "lodash";
import pipe from "lodash/fp/pipe";

// types
import { Arg } from "../types/args";

// regex looks for anything between triangles (<|*|>)
const extractVariablesArray = (variable: string) => {
  const templateVariable = variable.match(/(?<=\<\|)(.*?)(?=\|\>)/g);
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

export const generateBoilerplate = (
  command: string,
  source: string,
  args: Arg[]
) => {
  const rootPath = `./.boilerplate/${command}`;
  const makeFilesFolders = (path: string) => {
    const directoriesAndFiles = readdirSync(path);
    directoriesAndFiles.forEach((dirOrFile) => {
      if (dirOrFile !== "local.args.yml") {
        const nestedPath = `${path}/${dirOrFile}`;
        const stats = lstatSync(nestedPath);
        const [isFile, isDirectory] = [stats.isFile(), stats.isDirectory()];
        const writePath = nestedPath.replace(rootPath, source);

        // TODO: if file then replace any variables in file name with value
        // TODO: also, write the file contents (also replacing any variables with values)
        if (isFile) {
          console.log(`FILE ---> ${dirOrFile}`);
        }

        // TODO: if directory then replace any variables in folder name with value
        // TODO: also, recursively callback 'makeFilesFolders' to look for any nested files/folders
        if (isDirectory) {
          console.log(`DIR ---> ${dirOrFile}`);
        }

        console.log(writePath);
      }
    });
  };
  makeFilesFolders(rootPath);
};
