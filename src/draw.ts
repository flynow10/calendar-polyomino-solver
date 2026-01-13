import { Board } from "./solver/puzzle";

const pieceColors: { [k: string]: string } = {
  L: "#cd4444",
  F: "#cc7a44",
  S: "#cda444",
  P: "#83ba42",
  T: "#52cd7a",
  U: "#4eb5a8",
  V: "#4f9ac1",
  W: "#5365c5",
  X: "#8f52ae",
  N: "#ae44a1",
};
const backgroundColor = "#242424";

function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cell: string | null,
  squareCellWidth: number,
  squareCellHeight: number
) {
  const halfWidth = ctx.canvas.width / 2;
  const halfHeight = ctx.canvas.height / 2;
  if (cell !== null) {
    if (!cell.startsWith("Blocker")) {
      if (cell === "Wall") {
        ctx.fillStyle = backgroundColor;
      } else {
        if (pieceColors[cell]) {
          ctx.fillStyle = pieceColors[cell];
        } else {
          ctx.fillStyle = pieceColors[cell] =
            "#" +
            ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
        }
      }
    } else {
      ctx.fillStyle = "#fff";
    }
  } else {
    ctx.fillStyle = "#fff";
  }
  ctx.beginPath();
  const pos1 = rotatePos(
    x * squareCellWidth,
    y * squareCellHeight,
    halfWidth,
    halfHeight
  );
  ctx.moveTo(pos1[0], pos1[1]);
  const pos2 = rotatePos(
    (x + 1) * squareCellWidth,
    y * squareCellHeight,
    halfWidth,
    halfHeight
  );
  ctx.lineTo(pos2[0], pos2[1]);
  const pos3 = rotatePos(
    (x + 1) * squareCellWidth,
    (y + 1) * squareCellHeight,
    halfWidth,
    halfHeight
  );
  ctx.lineTo(pos3[0], pos3[1]);
  const pos4 = rotatePos(
    x * squareCellWidth,
    (y + 1) * squareCellHeight,
    halfWidth,
    halfHeight
  );
  ctx.lineTo(pos4[0], pos4[1]);
  ctx.fill();

  if (cell && cell.startsWith("Blocker")) {
    const text = cell.split(" ")[1];
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const [xPos, yPos] = rotatePos(
      x * squareCellWidth + squareCellWidth / 2,
      y * squareCellHeight + squareCellHeight / 2,
      halfWidth,
      halfHeight
    );
    ctx.fillStyle = "#000";
    ctx.fillText(text, xPos, yPos);
  }
}

function rotatePos(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number
) {
  let offsetX = x - halfWidth;
  let offsetY = y - halfHeight;
  if (halfWidth > halfHeight) {
    offsetY -= halfWidth - halfHeight;
  } else {
    offsetX -= halfHeight - halfWidth;
  }
  const angle = Math.atan2(offsetY, offsetX) + Math.PI / 4;
  const length = Math.sqrt((Math.pow(offsetX, 2) + Math.pow(offsetY, 2)) / 2);
  return [
    length * Math.cos(angle) + halfWidth,
    length * Math.sin(angle) + halfHeight,
  ];
}

export function drawBoard(ctx: CanvasRenderingContext2D, board: Board) {
  const longerSide = Math.max(ctx.canvas.height, ctx.canvas.width);
  const squareCellHeight = longerSide / board.grid.length;
  const squareCellWidth = longerSide / board.grid[0].length;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let row = 0; row < board.grid.length; row++) {
    for (let col = 0; col < board.grid[row].length; col++) {
      const cell = board.grid[row][col];

      drawCell(ctx, col, row, cell, squareCellWidth, squareCellHeight);
      // const directions = [
      //   [0, 1],
      //   [0, -1],
      //   [1, 0],
      //   [-1, 0],
      // ];
      // const walls = [];
      // for (let i = 0; i < 4; i++) {
      //   const direction = directions[i];
      //   const newRow = row + direction[0],
      //     newCol = col + direction[1];

      //   if (
      //     newRow < 0 ||
      //     newRow >= board.grid.length ||
      //     newCol < 0 ||
      //     newCol >= board.grid[col].length
      //   ) {
      //     if (blocked == null) walls.push(i);
      //     continue;
      //   }
      //   if (blocked !== board.grid[newRow][newCol]) {
      //     walls.push(i);
      //   }
      // }
      // ctx.strokeStyle = backgroundColor;
      // if (blocked !== null) {
      //   if (blocked.startsWith("Blocker")) {
      //     const text = blocked.split(" ")[1];
      //     ctx.font = "25px sans-serif";
      //     ctx.textBaseline = "middle";
      //     const textSize = ctx.measureText(text);
      //     const xPos = col * width + (width - textSize.width) / 2;
      //     const yPos = row * height + height / 2;
      //     ctx.fillStyle = "#000";
      //     ctx.fillText(text, xPos, yPos);
      //   } else {
      //     if (blocked === "Wall") {
      //       ctx.fillStyle = backgroundColor;
      //     } else {
      //       if (pieceColors[blocked]) {
      //         ctx.fillStyle = pieceColors[blocked];
      //       } else {
      //         ctx.fillStyle = pieceColors[blocked] =
      //           "#" +
      //           ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
      //       }
      //     }
      //     ctx.beginPath();
      //     ctx.rect(col * width, row * height, width + 1, height + 1);
      //     ctx.fill();
      //   }
      // }

      // for (let i = 0; i < walls.length; i++) {
      //   const wall = walls[i];
      //   ctx.beginPath();
      //   switch (wall) {
      //     case 0: {
      //       ctx.moveTo((col + 1) * width, row * height);
      //       ctx.lineTo((col + 1) * width, (row + 1) * height);
      //       break;
      //     }
      //     case 1: {
      //       ctx.moveTo(col * width, row * height);
      //       ctx.lineTo(col * width, (row + 1) * height);
      //       break;
      //     }
      //     case 2: {
      //       ctx.moveTo(col * width, (row + 1) * height);
      //       ctx.lineTo((col + 1) * width, (row + 1) * height);
      //       break;
      //     }
      //     case 3: {
      //       ctx.moveTo(col * width, row * height);
      //       ctx.lineTo((col + 1) * width, row * height);
      //       break;
      //     }
      //   }
      //   ctx.stroke();
      // }
    }
  }
}
