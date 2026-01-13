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

export function drawBoard(ctx: CanvasRenderingContext2D, blockers: Board) {
  const height = ctx.canvas.height / blockers.grid.length;
  const width = ctx.canvas.width / blockers.grid[0].length;
  for (let row = 0; row < blockers.grid.length; row++) {
    for (let col = 0; col < blockers.grid[row].length; col++) {
      const blocked = blockers.grid[row][col];
      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      const walls = [];
      for (let i = 0; i < 4; i++) {
        const direction = directions[i];
        const newRow = row + direction[0],
          newCol = col + direction[1];

        if (
          newRow < 0 ||
          newRow >= blockers.grid.length ||
          newCol < 0 ||
          newCol >= blockers.grid[col].length
        ) {
          if (blocked == null) walls.push(i);
          continue;
        }
        if (blocked !== blockers.grid[newRow][newCol]) {
          walls.push(i);
        }
      }
      ctx.strokeStyle = backgroundColor;
      if (blocked !== null) {
        if (blocked.startsWith("Blocker")) {
          const text = blocked.split(" ")[1];
          ctx.font = "25px sans-serif";
          ctx.textBaseline = "middle";
          const textSize = ctx.measureText(text);
          const xPos = col * width + (width - textSize.width) / 2;
          const yPos = row * height + height / 2;
          ctx.fillStyle = "#000";
          ctx.fillText(text, xPos, yPos);
        } else {
          if (blocked === "Wall") {
            ctx.fillStyle = backgroundColor;
          } else {
            if (pieceColors[blocked]) {
              ctx.fillStyle = pieceColors[blocked];
            } else {
              ctx.fillStyle = pieceColors[blocked] =
                "#" +
                ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
            }
          }
          ctx.beginPath();
          ctx.rect(col * width, row * height, width + 1, height + 1);
          ctx.fill();
        }
      }

      for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        ctx.beginPath();
        switch (wall) {
          case 0: {
            ctx.moveTo((col + 1) * width, row * height);
            ctx.lineTo((col + 1) * width, (row + 1) * height);
            break;
          }
          case 1: {
            ctx.moveTo(col * width, row * height);
            ctx.lineTo(col * width, (row + 1) * height);
            break;
          }
          case 2: {
            ctx.moveTo(col * width, (row + 1) * height);
            ctx.lineTo((col + 1) * width, (row + 1) * height);
            break;
          }
          case 3: {
            ctx.moveTo(col * width, row * height);
            ctx.lineTo((col + 1) * width, row * height);
            break;
          }
        }
        ctx.stroke();
      }
    }
  }
}
