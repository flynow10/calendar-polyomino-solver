import { Piece, PieceOrientation, PiecesList } from "./pieces";
import { Board } from "./puzzle";

export type Move = {
  name: string;
  orientation: PieceOrientation;
  x: number;
  y: number;
};

export function generateLegalMoves(
  board: Board,
  pieceList: Piece[] = PiecesList
): Move[] {
  return pieceList
    .filter((piece) => !board.usedPieces.includes(piece.name))
    .map((piece) => generatePieceMoves(board, piece))
    .flat();
}

export function generatePieceMoves(board: Board, piece: Piece): Move[] {
  const moves = [];

  for (let i = 0; i < piece.orientations.length; i++) {
    const orientation = piece.orientations[i];
    moves.push(...generateOrientationMoves(board, piece.name, orientation));
  }
  return moves;
}

export function generateOrientationMoves(
  board: Board,
  name: string,
  orientation: PieceOrientation
): Move[] {
  const moves: Move[] = [];
  for (let row = 0; row < board.grid.length; row++) {
    for (let col = 0; col < board.grid[row].length; col++) {
      let placed = true;

      for (let i = 0; i < orientation.length; i++) {
        for (let j = 0; j < orientation[i].length; j++) {
          const pieceCell = orientation[i][j];
          if (pieceCell === 0) continue;

          const boardY = row + i,
            boardX = col + j;

          if (
            boardY >= board.grid.length ||
            boardX >= board.grid[0].length ||
            board.grid[boardY][boardX] !== null
          ) {
            placed = false;
            break;
          }
        }
      }

      if (placed) {
        moves.push({
          name,
          orientation,
          x: col,
          y: row,
        });
      }
    }
  }
  return moves;
}
