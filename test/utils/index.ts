// packages
const del = require("del"); // delete folder and all contents within it
import { readdirSync } from "fs";

const doesBoilerplateDirExist = () => {
  return !!readdirSync("./").find((folder) => folder === ".boilerplate");
};

export const removeBoilerplateFolder = async () => {
  if (doesBoilerplateDirExist()) {
    return del("./.boilerplate");
  }
};
