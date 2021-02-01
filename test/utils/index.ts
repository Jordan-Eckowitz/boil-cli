// packages
import del from "del";
import { readdirSync } from "fs";

const doesDirExist = (folderName: string) => {
  return !!readdirSync("./").find((folder) => folder === folderName);
};

export const removeBoilerplateFolder = async () => {
  if (doesDirExist(".boilerplate")) {
    return del("./.boilerplate");
  }
};

export const removeExampleTemplate = async () => {
  if (doesDirExist("example")) {
    return del("./example");
  }
};
