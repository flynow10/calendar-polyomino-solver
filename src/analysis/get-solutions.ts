import { deflateSync, inflateSync } from "zlib";
import { SolutionFinder } from "../solver/algorithm-x";
import { PieceName } from "../solver/pieces";
import {
  AllMonths,
  AllWeekdays,
  createBlockers,
  Month,
  PuzzleDay,
} from "../solver/puzzle";
import * as fs from "fs";

type Solution = {
  [Key in PieceName]: number[];
};

type PuzzleData = {
  puzzle: PuzzleDay;
  solutions: Solution[];
};

const monthLengths: {
  [Key in Month]: number;
} = {
  Jan: 31,
  Feb: 29,
  Mar: 31,
  Apr: 30,
  May: 31,
  Jun: 30,
  Jul: 31,
  Aug: 31,
  Sep: 30,
  Oct: 31,
  Nov: 30,
  Dec: 31,
};

function createAllSolutionsFile() {
  const data: PuzzleData[] = [];
  let i = 0;
  for (let monthIndex = 0; monthIndex < AllMonths.length; monthIndex++) {
    const month = AllMonths[monthIndex];
    for (let day = 1; day <= monthLengths[month]; day++) {
      for (
        let weekdayIndex = 0;
        weekdayIndex < AllWeekdays.length;
        weekdayIndex++
      ) {
        const weekday = AllWeekdays[weekdayIndex];
        const puzzle = {
          day,
          month,
          weekday,
        };
        const solutions = solvePuzzle(puzzle);
        console.log("Solved puzzle: " + ++i);
        data.push(solutions);
      }
    }
  }

  return data;
}

function solvePuzzle(puzzle: PuzzleDay): PuzzleData {
  const puzzleData: PuzzleData = {
    puzzle,
    solutions: [],
  };

  const grid = createBlockers(puzzle);

  const solver = new SolutionFinder(grid);

  puzzleData.solutions = solver.matrix.solutions.map(matrixSolutionConvert);
  return puzzleData;
}

function matrixSolutionConvert(rows: string[][]): Solution {
  const solution: Solution = {
    F: [],
    L: [],
    N: [],
    P: [],
    S: [],
    T: [],
    U: [],
    V: [],
    W: [],
    X: [],
  };
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const sortedRow = row.slice().sort().reverse();
    const pieceName = sortedRow[0] as PieceName;

    for (let i = 1; i < sortedRow.length; i++) {
      const cell = sortedRow[i];
      const row = parseInt(cell[0]);
      const col = parseInt(cell[1]);
      solution[pieceName as PieceName].push(row * 8 + col);
    }
  }
  return solution;
}
const SolutionsPath = "./data/solutions.json.zip";

export function compressAndWriteSolutions() {
  const solutionData = createAllSolutionsFile();

  const fd = fs.openSync(SolutionsPath, "w");

  fs.writeSync(fd, deflateSync(JSON.stringify(solutionData)));

  fs.closeSync(fd);
}

export function decompressSolutions() {
  const buff = fs.readFileSync(SolutionsPath, { flag: "r" });
  const dataString = inflateSync(buff).toString("utf-8");
  return JSON.parse(dataString) as PuzzleData[];
}
