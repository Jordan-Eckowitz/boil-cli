global.BEGIN_SEQ = "<|";
global.END_SEQ = "|>";

export const globalYaml = () => `# Escape sequences
$begin:
  shorthand: $b
  description: Character sequence used to mark the beginning of a template parameter
  default: "${global.BEGIN_SEQ}"
$end:
  shorthand: $e
  description: Character sequence used to mark the end of a template parameter
  default: "${global.END_SEQ}"

# definition of 'filetype' arg
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

export const placeholderContent =
  () => `// ${global.BEGIN_SEQ}timestamp()${global.END_SEQ}
${global.BEGIN_SEQ}name${global.END_SEQ} = "hello world"
`;

export const templateFunctionContent =
  () => `// this is a template function - it can be invoked in templates using ${global.BEGIN_SEQ} timestamp() ${global.END_SEQ}
// see here for more details: https://jordan-eckowitz.github.io/boil-cli-docs/how-it-works/#template-functions
module.exports = function () {
  return Date.now();
};`;

export const readmeContent = `check out the documentation here: https://jordan-eckowitz.github.io/boil-cli-docs`;
