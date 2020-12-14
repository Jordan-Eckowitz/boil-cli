export interface Arg {
  name?: string;
  shorthand?: string;
  description?: string;
  default?: string;
  options?: string[];
  value?: string;
}

export interface ArgsObject {
  [key: string]: Arg;
}
