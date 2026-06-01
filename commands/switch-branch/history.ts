import { mkdir } from "node:fs/promises";
import path, { dirname } from "node:path";

const HISTORY_FILE_PATH = path.join(__dirname, "data", "branches.json");
const HISTORY_LIMIT = 5;

type History = Record<string, string[]>;
export let HISTORY: History = {};

async function createHistoryIfNeeded(path: string) {
  if (await Bun.file(path).exists()) {
    return;
  }
  const dir = dirname(path);
  await mkdir(dir, { recursive: true });
  await Bun.write(path, JSON.stringify({}));
}

export async function readHistory(path: string): Promise<History> {
  return await Bun.file(path).json();
}

export async function writeHistory(path: string, data: History) {
  await Bun.write(path, JSON.stringify(data));
}

export async function appendToHistory(repository: string, branch: string) {
  if (!HISTORY[repository]) {
    HISTORY[repository] = [];
  }
  HISTORY[repository].unshift(branch);
  if (HISTORY[repository].length > HISTORY_LIMIT) {
    HISTORY[repository].pop();
  }
  await writeHistory(HISTORY_FILE_PATH, HISTORY);
}

// Initialize history
(async () => {
  await createHistoryIfNeeded(HISTORY_FILE_PATH);
  HISTORY = await readHistory(HISTORY_FILE_PATH);
})();
