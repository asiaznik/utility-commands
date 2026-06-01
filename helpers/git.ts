import { $ } from "bun";
import { colorize, Style } from "./cli";

/**
 * Checks if Git is enabled in the current working directory.
 */
export async function isGitEnabled() {
  try {
    const result = await $`git rev-parse --is-inside-work-tree`.text();
    return result.trim() === "true";
  } catch {
    return false;
  }
}

/**
 * Retrieves the list of branches in the current Git repository.
 */
export async function getBranches() {
  const result = await $`git branch --format "%(refname:short)"`.text();
  return result
    .trim()
    .split("\n")
    .filter((b) => b.length > 0);
}

/**
 * Retrieves the current branch of the Git repository.
 */
export async function getCurrentBranch() {
  const result = await $`git rev-parse --abbrev-ref HEAD`.text();
  return result.trim();
}

/**
 * Checks out the specified branch in the Git repository.
 */
export async function checkoutBranch(branch: string) {
  try {
    await $`git checkout ${branch}`.text();
    const currentBranch = await getCurrentBranch();
    if (currentBranch === branch) {
      console.log(
        `Switched to branch: ${colorize(branch, [Style.Green, Style.Bold])}`,
      );
    } else {
      console.error(`Failed to switch to branch: ${branch}`);
    }
  } catch {
    console.error(`Failed to switch to branch: ${branch}`);
  }
}

/**
 * Retrieves the top-level directory of the Git repository.
 */
export async function getToplevel() {
  try {
    const result = await $`git rev-parse --show-toplevel`.text();
    return result.trim();
  } catch {
    return null;
  }
}
