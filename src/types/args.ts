export interface Arg {
  shorthand?: string;
  description?: string;
  default?: string;
  options?: string;
}

export interface ArgsObject {
  [key: string]: Arg;
}
