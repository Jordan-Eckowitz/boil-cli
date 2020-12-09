export const globalYaml = `# definition of 'source' argument
source: # argument will be called using --source
  shorthand: s # argument can be called using -s instead of --source
  required: true # argument must be provided by user

# definition of 'filetype' argument
filetype:
  shorthand: ft
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
`;

export const placeholderContent = `const ||name|| = "hello world"`;
