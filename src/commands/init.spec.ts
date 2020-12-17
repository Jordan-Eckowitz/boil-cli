export const globalYaml = `# definition of 'filetype' variable
filetype: # variable will be called using --filetype
  shorthand: ft # variable can be called using -ft instead of --filetype
  description: file type # used in help menu
  default: js # if variable not provided by user then default to this value
  options: # if user provides an input not in this list then throw an error
    - js
    - py
    - go
`;

export const localYaml = `# definition of 'name' variable
name: # variable will be called using --name
  shorthand: n # variable can be called using -n instead of --name
  description: component name # used in help menu
`;

export const placeholderContent = `<|name|> = "hello world"`;
