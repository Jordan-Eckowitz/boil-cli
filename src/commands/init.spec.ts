export const globalYaml = `# definition of 'filetype' argument
filetype: # argument will be called using --filetype
  shorthand: ft # argument can be called using -ft instead of --filetype
  description: file type # used in help menu
  default: js # if argument not provided by user then default to this value
  options: # if user provides an input not in this list then throw an error
    - js
    - ts
    - py
    - go
    - rb
    - java
`;

export const localYaml = `# definition of 'name' argument
name: # argument will be called using --name
  shorthand: n # argument can be called using -n instead of --name
  required: true # argument must be provided by user
  description: component name # used in help menu
`;

export const placeholderContent = `<|name|> = "hello world"`;
