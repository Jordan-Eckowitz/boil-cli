// packages
import { readdirSync, lstatSync } from "fs";

// regex looks for anything between double pipes (||*||)
const extractVariablesArray = (variable: string) => {
  const templateVariable = variable.match(/(?<=\|\|)(.*?)(?=\|\|)/g);
  // trim whitespaces
  if (templateVariable) {
    return templateVariable.map((variable) => variable.trim());
  }
  return [];
};

export const commandVariables = (command: string) => {
  const rootPath = `./.boilerplate/${command}`;
  const variables: string[] = [];

  // recursively look for template variables (||*||) in directory and file names
  const variablesFromDirectoryAndFileNames = (path: string) => {
    const directoriesAndFiles = readdirSync(path);
    directoriesAndFiles.forEach((dirOrFile) => {
      // log template variables within the current path
      extractVariablesArray(dirOrFile).forEach((variable) =>
        variables.push(variable)
      );
      // look if there are any nested directories
      const nestedPath = `${path}/${dirOrFile}`;
      if (lstatSync(nestedPath).isDirectory()) {
        const nestedDirectories = readdirSync(nestedPath);
        // if nested directories exist then recursively look for template variables at that path
        if (nestedDirectories) {
          variablesFromDirectoryAndFileNames(nestedPath);
        }
      }
    });
  };
  variablesFromDirectoryAndFileNames(rootPath);

  // TODO: look for template variables (||*||) in files names
  console.log(variables);
};
