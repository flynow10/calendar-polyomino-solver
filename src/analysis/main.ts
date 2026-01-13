import { decompressSolutions } from "./get-solutions";

function analyze() {
  const data = decompressSolutions();

  let max = 0;
  let min = 10000;
  let mean = 0;

  for (let i = 0; i < data.length; i++) {
    const puzzle = data[i];
    const numSolutions = puzzle.solutions.length;
    max = Math.max(max, numSolutions);
    min = Math.min(min, numSolutions);
    mean += numSolutions;
  }
  mean /= data.length;

  let median = 0;
  if (data.length % 2 === 0) {
    median =
      (data[data.length / 2].solutions.length +
        data[data.length / 2 + 1].solutions.length) /
      2;
  } else {
    median = data[(data.length + 1) / 2].solutions.length;
  }

  let std = 0;
  for (let i = 0; i < data.length; i++) {
    const solutions = data[i].solutions.length;
    std += Math.pow(solutions - mean, 2);
  }
  std /= data.length;
  std = Math.sqrt(std);

  console.log("Max Solutions: ", max);
  console.log("Min Solutions: ", min);
  console.log("Mean Solutions: ", mean);
  console.log("Median Solutions: ", median);
  console.log("Standard Deviation: ", std);
}

analyze();
