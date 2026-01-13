export type PuzzleDay = {
  day: number;
  weekday: Weekday;
  month: Month;
};

type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer A)[]
  ? A
  : never;

export type Weekday = ArrayElement<typeof AllWeekdays>;
export type Month = ArrayElement<typeof AllMonths>;

export const AllMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const AllWeekdays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

type BoardPiece = null | string;
export type Board = {
  usedPieces: string[];
  grid: BoardPiece[][];
};

export function createBlockers(puzzle: PuzzleDay): Board {
  const grid: BoardPiece[][] = [
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0],
  ].map((row) => row.map((cell) => (cell === 0 ? "Wall" : null)));

  const months: { [K in Month]: number } = {
    Jan: 20,
    Feb: 29,
    Mar: 12,
    Apr: 21,
    May: 30,
    Jun: 13,
    Jul: 22,
    Aug: 5,
    Sep: 14,
    Oct: 23,
    Nov: 6,
    Dec: 15,
  };

  const days: { [key: number]: number } = {
    1: 24,
    2: 17,
    3: 10,
    4: 3,
    5: 32,
    6: 25,
    7: 18,
    8: 11,
    9: 4,
    10: 33,
    11: 26,
    12: 19,
    13: 34,
    14: 27,
    15: 42,
    16: 35,
    17: 28,
    18: 43,
    19: 36,
    20: 51,
    21: 44,
    22: 37,
    23: 59,
    24: 52,
    25: 45,
    26: 38,
    27: 31,
    28: 60,
    29: 53,
    30: 46,
    31: 39,
  };

  const weekdays: { [Key in Weekday]: number } = {
    Mon: 48,
    Tue: 57,
    Wed: 40,
    Thu: 49,
    Fri: 58,
    Sat: 41,
    Sun: 50,
  };

  setRowCol(grid, months[puzzle.month], `Blocker ${puzzle.month}`);
  setRowCol(grid, days[puzzle.day], `Blocker ${puzzle.day}`);
  setRowCol(grid, weekdays[puzzle.weekday], `Blocker ${puzzle.weekday}`);
  return {
    grid,
    usedPieces: [],
  };
}

function setRowCol(arr: BoardPiece[][], index: number, value: BoardPiece) {
  arr[Math.floor(index / arr.length)][index % arr[0].length] = value;
}
