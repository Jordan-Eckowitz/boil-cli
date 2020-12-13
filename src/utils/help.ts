// packages
import { cli } from "cli-ux";

export const commandArgsTable = (
  array: object[],
  trigger: string,
  command: string
) => {
  console.log(`\nboil ${trigger} ${command} ARGS\n`);
  return cli.table(array, {
    name: { minWidth: 15 },
    shorthand: { minWidth: 15 },
    description: { minWidth: 30 },
    default: { minWidth: 15 },
    options: { minWidth: 10 },
  });
};
