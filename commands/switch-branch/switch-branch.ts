import {
  CTRL_C,
  clearScreen,
  colorize,
  DOWN_ARROW,
  drawRows,
  ENTER_KEY,
  ESC_KEY,
  moveCursorUp,
  QUIT,
  Style,
  UP_ARROW,
  VIM_DOWN,
  VIM_UP,
} from "../../helpers/cli";
import {
  checkoutBranch,
  getBranches,
  getCurrentBranch,
  getToplevel,
  isGitEnabled,
} from "../../helpers/git";

import { appendToHistory, HISTORY } from "./history";

const INTRO = [
  colorize("Select a branch to checkout:", [Style.Cyan, Style.Bold]),
  colorize(
    "  (Use up/down or j/k to navigate, press enter to select, or press q to quit.)",
    [Style.Dim],
  ),
  "",
];

/**
 * Performs the branch switching process.
 */
export default async function switchBranch() {
  const repository = await getToplevel();
  if (!(await isGitEnabled()) || !repository) {
    console.error("Git is not enabled in the current working directory.");
    return;
  }

  let branches = await getBranches();
  if (branches.length === 0) {
    console.error("No branches found.");
    return;
  }

  if (HISTORY[repository]) {
    HISTORY[repository] = HISTORY[repository].filter((b) =>
      branches.includes(b),
    );
  }

  branches = [...new Set([...(HISTORY[repository] ?? []), ...branches.sort()])];

  const currentBranch = await getCurrentBranch();
  let selectedIndex = branches.indexOf(currentBranch);

  // Calculate the number of lines needed for the interface
  const interfaceLines = branches.length + INTRO.length;

  // Reserve space in the terminal
  for (let i = 0; i < interfaceLines; i++) {
    process.stdout.write("\n");
  }

  function displayBranches() {
    drawRows([
      ...INTRO,
      ...branches.map((branch, index) => {
        let marker = " ";
        let color = Style.White;
        if (index === selectedIndex) {
          marker = ">";
          color = Style.Yellow;
        }
        if (branch === currentBranch) {
          marker = "*";
          color = Style.Green;
        }

        return colorize(
          `${marker} ${branch}`,
          index === selectedIndex ? [color, Style.Bold] : [color],
        );
      }),
    ]);
  }

  function hideBranches() {
    // Move to the start of the reserved space
    moveCursorUp(interfaceLines);

    // Clear the reserved space
    clearScreen();
  }

  displayBranches();

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", (key) => {
    switch (key) {
      case UP_ARROW:
      case VIM_UP:
        if (selectedIndex > 0) {
          selectedIndex--;
          displayBranches();
        }
        break;
      case DOWN_ARROW:
      case VIM_DOWN:
        if (selectedIndex < branches.length - 1) {
          selectedIndex++;
          displayBranches();
        }
        break;
      case ENTER_KEY:
        hideBranches();
        process.stdin.setRawMode(false);
        process.stdin.pause();
        // biome-ignore lint/style/noNonNullAssertion: expected
        checkoutBranch(branches[selectedIndex]!);
        // biome-ignore lint/style/noNonNullAssertion: expected
        appendToHistory(repository, branches[selectedIndex]!);

        break;
      case CTRL_C:
      case ESC_KEY:
      case QUIT:
        hideBranches();
        process.exit(1);
        break;
    }
  });
}
