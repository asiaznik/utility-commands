import switchBranch from "./commands/switch-branch/switch-branch";
import { colorize, getOptions, Style } from "./helpers/cli";

const options = getOptions();
if (options["switch-branch"] === true) {
  switchBranch();
}

if (options.help === true || Object.keys(options).length === 0) {
  console.log("Usage: bun index.ts [options]");
  console.log("");
  console.log(colorize("Options:", [Style.Bold]));
  console.log(
    `  ${colorize("--switch-branch", [Style.Yellow])}\t Runs the switch-branch command`,
  );
  console.log(
    `  ${colorize("--help", [Style.Yellow])}\t\t Displays this help message`,
  );
  console.log("");
  console.log(colorize("Recommended alias:", [Style.Bold]));
  console.log(
    colorize(
      `  alias switch-branch="bun run ~/.../utility-commands/index.ts --switch-branch"`,
      [Style.BrightWhite],
    ),
  );
}
