// packages
import { expect, test } from "@oclif/test";

// utils
import { removeBoilerplateFolder } from "../utils";

describe("create-function", () => {
  before(async function () {
    await removeBoilerplateFolder();
  });

  test
    .stdout()
    .command(["create-function"])
    .it("check if boilerplate directory exists", (ctx) => {
      expect(ctx.stdout).to.contain(
        "looks like you don't have a '.boilerplate' directory"
      );
    });

  test
    .stdout()
    .command(["init"])
    .command(["create-function"])
    .it("check user provides template function name", (ctx) => {
      expect(ctx.stdout).to.contain(
        "you need to provide a template function name"
      );
    });

  test
    .stdout()
    .command(["create-function", "example"])
    .it("create a new template function", (ctx) => {
      expect(ctx.stdout).to.contain("./.boilerplate/example.js");
    });

  test
    .stdout()
    .command(["create-function", "example"])
    .it(
      "checks if a template function with the input name already exists",
      (ctx) => {
        expect(ctx.stdout).to.contain(
          "template function 'example.js' already exists"
        );
      }
    );
});
