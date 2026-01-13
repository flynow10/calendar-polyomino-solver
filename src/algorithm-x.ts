import { generateLegalMoves } from "./brute-force";
import { PiecesList } from "./pieces";
import { Board } from "./puzzle";

export class SolutionFinder {
  public board: Board;
  public solutions: Board[] = [];

  constructor(board: Board) {
    this.board = board;
    this.findSolutions();
  }

  public findSolutions() {
    const columnNames = this.createColumnNames();
    const matrix = this.createRows(columnNames);
    const sparseMatrix = new SparseMatrixDLX(matrix, columnNames);
    sparseMatrix.search(0);
    this.solutions = sparseMatrix.solutions.map((solu) =>
      this.convertSolutionToBoard(solu)
    );
  }

  private convertSolutionToBoard(solution: string[][]): Board {
    const solutionBoard = structuredClone(this.board);
    for (let rowIndex = 0; rowIndex < solution.length; rowIndex++) {
      const row = solution[rowIndex];
      const sortedRow = row.slice().sort().reverse();
      const pieceName = sortedRow[0];
      solutionBoard.usedPieces.push(pieceName);
      for (let i = 1; i < sortedRow.length; i++) {
        const cell = sortedRow[i];
        solutionBoard.grid[parseInt(cell[0])][parseInt(cell[1])] = pieceName;
      }
    }
    return solutionBoard;
  }

  private createRows(columnNames: string[]) {
    const legalMoves = generateLegalMoves(this.board);
    const matrix = [];
    for (let i = 0; i < legalMoves.length; i++) {
      const move = legalMoves[i];
      const row = new Array(columnNames.length).fill(0);
      row[columnNames.indexOf(move.name)] = 1;
      for (let pieceRow = 0; pieceRow < move.orientation.length; pieceRow++) {
        for (
          let pieceCol = 0;
          pieceCol < move.orientation[pieceRow].length;
          pieceCol++
        ) {
          if (move.orientation[pieceRow][pieceCol] === 1) {
            row[
              columnNames.indexOf(`${move.y + pieceRow}${move.x + pieceCol}`)
            ] = 1;
          }
        }
      }
      matrix.push(row);
    }
    return matrix;
  }

  private createColumnNames() {
    const columnNames: string[] = [];
    columnNames.push(...PiecesList.map((piece) => piece.name));
    for (let row = 0; row < this.board.grid.length; row++) {
      for (let column = 0; column < this.board.grid[row].length; column++) {
        if (this.board.grid[row][column] === null) {
          columnNames.push(`${row}${column}`);
        }
      }
    }
    return columnNames;
  }
}

export class SparseMatrixDLX {
  public root: NodeObj;
  public partial: NodeObj[] = [];
  public solutions: string[][][] = [];

  constructor(matrix: number[][], names: string[]) {
    this.root = new NodeObj();
    const objMatrix: (NodeObj | null)[][] = [];
    for (let row = 0; row < matrix.length; row++) {
      objMatrix.push([]);
      for (let column = 0; column < matrix[row].length; column++) {
        const cell = matrix[row][column];
        if (cell) {
          objMatrix[row].push(new NodeObj());
        } else {
          objMatrix[row].push(null);
        }
      }
    }
    for (let row = 0; row < objMatrix.length; row++) {
      let lastCell: NodeObj = null!;
      for (let column = objMatrix[row].length - 1; column >= 0; column--) {
        const cell = objMatrix[row][column];
        if (cell) {
          lastCell = cell;
          break;
        }
      }
      for (let column = 0; column < objMatrix[row].length; column++) {
        const cell = objMatrix[row][column];
        if (cell) {
          cell.Left = lastCell;
          lastCell.Right = cell;
          lastCell = cell;
        }
      }
    }

    for (let column = 0; column < objMatrix[0].length; column++) {
      const columnHeader = this.addColumn(names[column]);
      for (let row = 0; row < objMatrix.length; row++) {
        const cell = objMatrix[row][column];
        if (cell) {
          cell.Down = columnHeader;
          cell.Up = columnHeader.Up;
          columnHeader.Up.Down = cell;
          columnHeader.Up = cell;
          cell.Header = columnHeader;
          columnHeader.Size++;
        }
      }
    }
  }

  public search(k: number = 0) {
    if (k === 0) {
      this.solutions = [];
    }
    if (this.root.Right === this.root) {
      this.solutions.push(this.formatSolution(k));
      return;
    }

    let column = this.findColumn();
    this.coverColumn(column);
    let r = column.Down;
    while (r !== column) {
      if (this.partial.length <= k) {
        this.partial.push(r);
      } else {
        this.partial[k] = r;
      }
      let j = r.Right;
      while (j !== r) {
        this.coverColumn(j.Header);
        j = j.Right;
      }
      this.search(k + 1);
      r = this.partial[k];
      column = r.Header;
      j = r.Left;
      while (j !== r) {
        this.unCoverColumn(j.Header);
        j = j.Left;
      }
      r = r.Down;
    }
    this.unCoverColumn(column);
  }

  private findColumn() {
    let c = this.root.Right;
    let j = this.root.Right;
    let s = Number.MAX_VALUE;
    while (j !== this.root) {
      if (j.Size < s) {
        c = j;
        s = j.Size;
      }
      j = j.Right;
    }
    return c;
  }

  private coverColumn(column: NodeObj) {
    column.Right.Left = column.Left;
    column.Left.Right = column.Right;
    let i = column.Down;

    while (i !== column) {
      let j = i.Right;
      while (j !== i) {
        j.Down.Up = j.Up;
        j.Up.Down = j.Down;
        j.Header.Size--;
        j = j.Right;
      }
      i = i.Down;
    }
  }

  private unCoverColumn(column: NodeObj) {
    let i = column.Up;
    while (i !== column) {
      let j = i.Left;
      while (j !== i) {
        j.Header.Size++;
        j.Down.Up = j;
        j.Up.Down = j;
        j = j.Left;
      }
      i = i.Up;
    }
    column.Right.Left = column;
    column.Left.Right = column;
  }

  public printSolution(k: number): string {
    const solutions: string[] = [];
    for (let i = 0; i < k; i++) {
      const node = this.partial[i];
      const solution: string[] = [];
      solution.push(node.Header.Name);
      let j = node.Right;
      while (j !== node) {
        solution.push(j.Header.Name);
        j = j.Right;
      }
      solutions.push(solution.join(", "));
    }
    return solutions.join("\n");
  }

  public formatSolution(k: number): string[][] {
    const rows: string[][] = [];
    for (let i = 0; i < k; i++) {
      const node = this.partial[i];
      const row: string[] = [];
      row.push(node.Header.Name);
      let j = node.Right;
      while (j !== node) {
        row.push(j.Header.Name);
        j = j.Right;
      }
      rows.push(row);
    }
    return rows;
  }

  public addColumn(name: string) {
    const columnHeader: NodeObj = new NodeObj(this.root.Left, this.root);
    columnHeader.Name = name;
    columnHeader.Size = 0;
    columnHeader.Up = columnHeader;
    columnHeader.Down = columnHeader;
    columnHeader.Header = columnHeader;
    this.root.Left.Right = columnHeader;
    this.root.Left = columnHeader;
    return columnHeader;
  }
}

class NodeObj {
  public Left: NodeObj;
  public Right: NodeObj;
  public Up: NodeObj = this;
  public Down: NodeObj = this;
  public Header: NodeObj = this;
  public Name: string = "";
  public Size: number = 0;

  constructor(left: NodeObj = this, right: NodeObj = this) {
    this.Left = left;
    this.Right = right;
  }
}
