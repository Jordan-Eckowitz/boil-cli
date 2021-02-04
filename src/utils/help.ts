// packages
import { cli } from "cli-ux";

export const templateArgsTable = (
  array: object[],
  trigger: string,
  template: string
) => {
  console.log(`\nboil ${trigger} ${template} ARGS\n`);
  return cli.table(array, {
    name: { minWidth: 15, header: "Name [--]" },
    shorthand: { minWidth: 20, header: "Shorthand [-]" },
    default: { minWidth: 15 },
    options: { minWidth: 10 },
    description: { minWidth: 30 },
  });
};
