import { generateLegalMoves, Move } from "./solver/move-generator";
import { PiecesList } from "./solver/pieces";
import { Board } from "./solver/puzzle";
const ShortPieceList = [PiecesList[9], PiecesList[4]];
const L = PiecesList[9];
const P = PiecesList[4];
function createState(move: Move, boardSize: number = 3) {
  return ShortPieceList.map((piece) => [
    move.name === piece.name ? move.y * boardSize + move.x : 0,
    move.name === piece.name
      ? piece.orientations.indexOf(move.orientation) + 1
      : 0,
  ]).flat();
}

function createAddState(state: number[], move: Move, boardSize: number = 3) {
  const newState = createState(move, boardSize);
  for (let i = 0; i < state.length; i++) {
    newState[i] += state[i];
  }

  return newState;
}

function stateToString(state: number[]): string {
  return `(${state.join(",")})`;
}

export function createStates() {
  const legalMoves = generateLegalMoves(generateBoard(), ShortPieceList);
  console.log(legalMoves);
  return legalMoves.map((move) => createState(move));
}

export function createConnections() {
  const connections = [];
  const LStates = generateLegalMoves(generateBoard(), [L]).map((move) =>
    stateToString(createState(move))
  );
  console.log(LStates.join("\n"));
  for (let i = 0; i < LStates.length; i++) {
    // {
    // const i = 0;
    const state1 = LStates[i];
    for (let j = i + 1; j < LStates.length; j++) {
      if (i == j) continue;
      const state2 = LStates[j];
      connections.push(`${state1} ${state2}`);
    }
    // }
  }
  const PStates = generateLegalMoves(generateBoard(), [P]).map((move) =>
    stateToString(createState(move))
  );
  console.log(PStates.join("\n"));
  for (let i = 0; i < PStates.length; i++) {
    // {
    // const i = 0;
    const state1 = PStates[i];
    for (let j = i + 1; j < PStates.length; j++) {
      if (i == j) continue;
      const state2 = PStates[j];
      connections.push(`${state1} ${state2}`);
    }
    // }
  }

  const EndStates = [
    [0, 1, 1, 3],
    [0, 2, 1, 4],
    [1, 3, 0, 1],
    [1, 4, 0, 2],
    [0, 5, 3, 6],
    [3, 6, 0, 5],
    [0, 7, 3, 8],
    [3, 8, 0, 7],
  ];
  console.log(EndStates.map((s) => stateToString(s)).join("\n"));
  for (let j = 0; j < EndStates.length; j++) {
    const state = EndStates[j];
    const stateString = stateToString(state);
    connections.push(
      `${stateToString([state[0], state[1], 0, 0])} ${stateString}`
    );
    connections.push(
      `${stateToString([0, 0, state[2], state[3]])} ${stateString}`
    );
  }
  return connections;
}

function generateBoard(boardSize: number = 3): Board {
  return {
    grid: new Array(boardSize)
      .fill(0)
      .map(() => new Array(boardSize).fill(null)),
    usedPieces: [],
  };
}
