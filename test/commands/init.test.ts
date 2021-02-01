// packages
import { expect, test } from "@oclif/test";

// utils
import { removeBoilerplateFolder } from "../utils";

describe("init", () => {
  before(async function () {
    await removeBoilerplateFolder();
  });

  test
    .stdout()
    .command(["init"])
    .it("creates boilerplate directory", (ctx) => {
      expect(ctx.stdout).to.contain("'.boilerplate' folder has been created");
    });

  test
    .stdout()
    .command(["init"])
    .it("boilerplate directory already exists", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like you already have a '.boilerplate' folder"
      );
    });
});
