export const globalYaml = `# definition of 'filetype' arg
filetype: # arg will be called using --filetype
  shorthand: ft # arg can be called using -ft instead of --filetype
  description: file type # used in help menu
  default: js # if arg not provided by user then default to this value
  options: # if user provides an input not in this list then throw an error
    - js
    - py
    - go
`;

export const localYaml = `# definition of 'name' arg
name: # arg will be called using --name
  shorthand: n # arg can be called using -n instead of --name
  description: component name # used in help menu
`;

export const placeholderContent = `// <|timestamp()|>
<|name|> = "hello world"
`;

export const templateFunctionContent = `module.exports = function () {
  return Date.now();
};`;
