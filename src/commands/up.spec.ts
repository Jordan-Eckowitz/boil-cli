// packages
import { readdirSync } from "fs";

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
  const variables: string[] = [];
  // TODO: look for template variables (||*||) in directory names
  const directoryNames = readdirSync(`./.boilerplate/${command}`);
  directoryNames.forEach((dir) => {
    const variableNames = extractVariablesArray(dir);
    variableNames.forEach((variable) => variables.push(variable));
  });
  console.log(variables);
  /*
  
  
  
  
  */
  // TODO: look for template variables (||*||) in files names
  // TODO: look for template variables (||*||) in files names
};
