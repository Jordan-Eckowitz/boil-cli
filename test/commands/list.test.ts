// packages
import { expect, test } from "@oclif/test";
import { mkdirSync } from "fs";

// utils
import { removeBoilerplateFolder } from "../utils";

describe("list", () => {
  before(async function () {
    await removeBoilerplateFolder();
  });

  test
    .stdout()
    .command(["list"])
    .it("check if boilerplate directory exists", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like you don't have a '.boilerplate' directory"
      );
    });

  test
    .stdout()
    .do(() => mkdirSync("./.boilerplate"))
    .command(["list"])
    .it("check that there are commands in the boilerplate directory", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like you haven't created any commands yet"
      );
    });

  test
    .stdout()
    .command(["create", "example"])
    .command(["create", "another-example"])
    .command(["list"])
    .it("check that the list contains created templates", (ctx) => {
      expect(ctx.stdout).to.contain("boil up example");
      expect(ctx.stdout).to.contain("boil up another-example");
    });
});
