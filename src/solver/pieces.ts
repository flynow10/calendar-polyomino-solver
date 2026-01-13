export type Piece = {
  name: string;
  canonical: PieceOrientation;
  orientations: PieceOrientation[];
};

export type PieceOrientation = number[][];

export const PiecesList: Piece[] = [
  createPiece("X", [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  createPiece("F", [
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0],
  ]),
  createPiece("U", [
    [1, 0, 1],
    [1, 1, 1],
  ]),
  createPiece("W", [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ]),
  createPiece("P", [
    [1, 1],
    [1, 1],
    [1, 0],
  ]),
  createPiece("N", [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, 0],
  ]),
  createPiece("V", [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ]),
  createPiece("T", [
    [1, 1, 1],
    [0, 1, 0],
  ]),
  createPiece("S", [
    [0, 1, 1],
    [1, 1, 0],
  ]),
  createPiece("L", [
    [1, 0],
    [1, 0],
    [1, 1],
  ]),
];

export function createPiece(name: string, canonical: PieceOrientation): Piece {
  return {
    name,
    canonical,
    orientations: createPieceOrientations(canonical),
  };
}

export function createPieceOrientations(
  canonicalOrientation: PieceOrientation
) {
  const orientations: PieceOrientation[] = [];
  orientations.push(canonicalOrientation);
  orientations.push(flipVertical(canonicalOrientation));
  orientations.push(flipHorizontal(canonicalOrientation));
  orientations.push(flipVertical(flipHorizontal(canonicalOrientation)));

  const T = transpose(canonicalOrientation);

  orientations.push(T);
  orientations.push(flipVertical(T));
  orientations.push(flipHorizontal(T));
  orientations.push(flipVertical(flipHorizontal(T)));

  return orientations.filter((orientation, i) => {
    return i === orientations.findIndex((a) => deepArrayEqual(a, orientation));
  });
}

function deepArrayEqual(array1: number[][], array2: number[][]) {
  if (
    array1.length !== array2.length ||
    array1[0].length !== array2[0].length
  ) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array1[0].length; j++) {
      if (array1[i][j] !== array2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function flipVertical(matrix: number[][]) {
  const flipped = new Array(matrix.length)
    .fill(0)
    .map(() => new Array(matrix[0].length));

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      flipped[matrix.length - i - 1][j] = matrix[i][j];
    }
  }
  return flipped;
}

function flipHorizontal(matrix: number[][]) {
  const flipped = new Array(matrix.length)
    .fill(0)
    .map(() => new Array(matrix[0].length));

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      flipped[i][matrix[i].length - 1 - j] = matrix[i][j];
    }
  }

  return flipped;
}

function transpose(matrix: number[][]) {
  const T = new Array(matrix[0].length)
    .fill(0)
    .map(() => new Array(matrix.length));

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      T[j][i] = matrix[i][j];
    }
  }
  return T;
}
