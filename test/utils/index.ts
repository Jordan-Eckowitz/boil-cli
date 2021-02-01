// packages
import del from "del";
import { readdirSync } from "fs";

const doesBoilerplateDirExist = () => {
  return !!readdirSync("./").find((folder) => folder === ".boilerplate");
};

export const removeBoilerplateFolder = async () => {
  if (doesBoilerplateDirExist()) {
    return del("./.boilerplate");
  }
};
