// packages
import { expect, test } from "@oclif/test";
import { writeFileSync } from "fs";

// utils
import { removeBoilerplateFolder } from "../utils";

describe("up", () => {
  before(async function () {
    await removeBoilerplateFolder();
  });

  test
    .stdout()
    .command(["up", "component"])
    .it("check if boilerplate directory exists", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like you don't have a '.boilerplate' directory"
      );
    });

  test
    .stdout()
    .command(["init"])
    .command(["up", "example"])
    .it("if there's no matching command then throw an error", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like there isn't a command called 'example'"
      );
    });

  test
    .stdout()
    .command(["create", "bad-example"])
    .do(() => writeFileSync("./.boilerplate/bad-example/<|name|>.js", ""))
    .command(["up", "bad-example"])
    .it("check all template args have been defined", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like your command has template args that haven't been defined"
      );
    });

  test
    .stdout()
    .command(["create", "another-bad-example"])
    .do(() =>
      writeFileSync("./.boilerplate/another-bad-example/<|example()|>.js", "")
    )
    .command(["up", "another-bad-example"])
    .it("check all functional args have been defined", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like your command has functional args that haven't been defined"
      );
    });

  test
    .stdout()
    .command(["up", "component", "x"])
    .it("check all input args have flags (i.e. --* or -*)", (ctx) => {
      expect(ctx.stdout).to.contain(
        "all your arg flags should begin with --(name) or -(shorthand)"
      );
    });
});
