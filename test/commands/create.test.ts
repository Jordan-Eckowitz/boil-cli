// packages
import { expect, test } from "@oclif/test";
import { readFileSync } from "fs";

// utils
import { removeBoilerplateFolder } from "../utils";

describe("create", () => {
  before(async function () {
    await removeBoilerplateFolder();
  });

  test
    .stdout()
    .command(["create"])
    .it("check if boilerplate directory exists", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like you don't have a '.boilerplate' directory"
      );
    });

  test
    .stdout()
    .command(["init"])
    .command(["create"])
    .it("check user provides template name", (ctx) => {
      expect(ctx.stdout).to.contain("you need to provide a template name");
    });

  test
    .stdout()
    .command(["create", "component"])
    .it("checks if a template with the input name already exists", (ctx) => {
      expect(ctx.stdout).to.contain("template 'component' already exists");
    });

  test
    .stdout()
    .command(["create", "example"])
    .it("create a new template", (ctx) => {
      expect(ctx.stdout).to.contain("./.boilerplate/example");
    });

  test
    .stdout()
    .command(["create", "another-example", "--args", "abc"])
    .it("create a new template with --args", () => {
      const data = readFileSync(
        "./.boilerplate/another-example/local.args.yml",
        "utf8"
      );
      expect(data).to.contain("abc");
    });

  test
    .stdout()
    .command(["create", "yet-another-example", "-a", "abc"])
    .it("create a new template with shorthand for args (-a)", () => {
      const data = readFileSync(
        "./.boilerplate/yet-another-example/local.args.yml",
        "utf8"
      );
      expect(data).to.contain("abc");
    });
});
