// packages
import { expect, test } from "@oclif/test";
import { writeFileSync } from "fs";
import shell from "shelljs";

// utils
import { removeBoilerplateFolder, removeExampleTemplate } from "../utils";
import { BEGIN_ESCAPE, END_ESCAPE } from "./../../src/commands/init.spec";

/** For the `up` command `static strict = false` to allow any user inputs.
 *  This results in the `.command([])` method not always being able to parse the args.
 *  A workaround is to run the command through the shell directly. */
const exec = (cmd: string) => shell.exec(`bin/run up ${cmd}`, { silent: true });

describe("up", () => {
  before(async function () {
    await removeBoilerplateFolder();
  });

  after(async function () {
    await removeExampleTemplate();
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
        "looks like there isn't a template called 'example'"
      );
    });

  test
    .stdout()
    .command(["create", "bad-example"])
    .do(() =>
      writeFileSync(
        `./.boilerplate/bad-example/${BEGIN_ESCAPE}name${END_ESCAPE}.js`,
        ""
      )
    )
    .command(["up", "bad-example"])
    .it("check all template args have been defined", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like your template has template args that haven't been defined"
      );
    });

  test
    .stdout()
    .command(["create", "another-bad-example"])
    .do(() =>
      writeFileSync(
        `./.boilerplate/another-bad-example/${BEGIN_ESCAPE}example()${END_ESCAPE}.js`,
        ""
      )
    )
    .command(["up", "another-bad-example"])
    .it("check all functional args have been defined", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like your template has functional args that haven't been defined"
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

  test
    .add("val", exec("component"))
    .do(({ val }) =>
      expect(val).to.contain("your args don't match the template requirements")
    )
    .it("check user has provided all required args");

  test
    .add("val", exec("component --name example"))
    .do(({ val }) => expect(val).to.contain("writing: ./example/example.js"))
    .it("generate template");
});
