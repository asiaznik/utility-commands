export enum Style {
  // Foreground colors
  Black = "30",
  Red = "31",
  Green = "32",
  Yellow = "33",
  Blue = "34",
  Magenta = "35",
  Cyan = "36",
  White = "37",

  // Bright foreground colors
  BrightBlack = "90",
  BrightRed = "91",
  BrightGreen = "92",
  BrightYellow = "93",
  BrightBlue = "94",
  BrightMagenta = "95",
  BrightCyan = "96",
  BrightWhite = "97",

  // Background colors
  BgBlack = "40",
  BgRed = "41",
  BgGreen = "42",
  BgYellow = "43",
  BgBlue = "44",
  BgMagenta = "45",
  BgCyan = "46",
  BgWhite = "47",

  // Bright background colors
  BgBrightBlack = "100",
  BgBrightRed = "101",
  BgBrightGreen = "102",
  BgBrightYellow = "103",
  BgBrightBlue = "104",
  BgBrightMagenta = "105",
  BgBrightCyan = "106",
  BgBrightWhite = "107",

  // Additional styles
  Reset = "0",
  Bold = "1",
  Dim = "2",
  Italic = "3",
  Underline = "4",
  Blink = "5",
  Reverse = "7",
  Hidden = "8",
  Strikethrough = "9",
}

export const UP_ARROW = "\u001B\u005B\u0041";
export const DOWN_ARROW = "\u001B\u005B\u0042";
export const ENTER_KEY = "\r";
export const CTRL_C = "\u0003";
export const ESC_KEY = "\u001B";
export const QUIT = "q";
export const VIM_UP = "k";
export const VIM_DOWN = "j";

/**
 * Colors the given text using ANSI escape codes.
 */
export function colorize(text: string, styles: Style[]): string {
  const code = styles.join(";");
  return `\x1b[${code}m${text}\x1b[0m`;
}

/**
 * Saves the current cursor position.
 */
export function saveCursor() {
  process.stdout.write("\u001B[s");
}

/**
 * Restores the cursor to the last saved position.
 */
export function restoreCursor() {
  process.stdout.write("\u001B[u");
}

/**
 * Moves the cursor up by the specified number of rows.
 */
export function moveCursorUp(rows: number) {
  process.stdout.write(`\u001B[${rows}A`);
}

/**
 * Clears the screen from the cursor position to the end.
 */
export function clearScreen() {
  process.stdout.write("\u001B[J");
}

/**
 * Draws a list of rows to the screen, saving the cursor position and restoring it afterward.
 */
export function drawRows(rows: string[]) {
  saveCursor();
  moveCursorUp(rows.length);
  clearScreen();
  rows.forEach((line) => {
    process.stdout.write(`${line}\n`);
  });
  restoreCursor();
}

/**
 * Parses the command line arguments and returns an object of options.
 */
export function getOptions() {
  const args = Bun.argv.slice(2);
  const options: Record<string, string | boolean | undefined> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i]?.startsWith("--")) {
      const option = args[i]?.slice(2);
      if (!option) continue;
      const value =
        args[i + 1] && !args[i + 1]?.startsWith("--") ? args[i + 1] : true;

      options[option] = value;
      if (value !== true) i++; // Skip the next argument if it's a value
    }
  }
  return options;
}
