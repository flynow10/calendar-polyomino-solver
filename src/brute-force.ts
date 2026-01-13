import { Piece, PieceOrientation, PiecesList } from "./pieces";
import { Board } from "./puzzle";

// Find Solution

export class SolutionFinder {
  public completedBoard: Board | null = null;

  public search(board: Board) {
    const moves = generateLegalMoves(board);

    if (moves.length === 0) {
      if (board.usedPieces.length === 10) {
        this.completedBoard = board;
        return true;
      }
      return false;
    }

    for (let row = 0; row < board.grid.length; row++) {
      for (let col = 0; col < board.grid[row].length; col++) {
        const cell = board.grid[row][col];
        if (cell !== null) {
          continue;
        }

        let cellCovered = false;
        for (let i = 0; i < moves.length; i++) {
          const move = moves[i];
          if (moveCoversCell(move, row, col)) {
            cellCovered = true;
            break;
          }
        }

        if (!cellCovered) {
          return false;
        }
      }
    }

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const newBoard = placePiece(board, move);
      if (this.search(newBoard)) {
        return true;
      }
    }
    return false;
  }
}

// Place Piece

export function placePiece(board: Board, move: Move) {
  const newBoard = structuredClone(board);
  for (let i = 0; i < move.orientation.length; i++) {
    for (let j = 0; j < move.orientation[i].length; j++) {
      if (move.orientation[i][j] === 1) {
        newBoard.grid[move.y + i][move.x + j] = move.name;
      }
    }
  }
  newBoard.usedPieces.push(move.name);

  return newBoard;
}

export function moveCoversCell(move: Move, row: number, col: number): boolean {
  if (
    row < move.y ||
    col < move.x ||
    row >= move.orientation.length + move.y ||
    col >= move.orientation[0].length + move.x
  )
    return false;

  return move.orientation[row - move.y][col - move.x] === 1;
}

// Move Generation

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

//
