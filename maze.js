const numRows = 16;
const numCols = 16;
const cellSize = 25;

const mazeCanvas = document.getElementById('maze');
const ctx = mazeCanvas.getContext('2d');

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }
}

const grid = [];
for (let row = 0; row < numRows; row++) {
  grid[row] = [];
  for (let col = 0; col < numCols; col++) {
    grid[row][col] = new Cell(row, col);
  }
}

function carveMaze(row, col) {
  const cell = grid[row][col];
  cell.visited = true;

  const directions = [
    { row: -1, col: 0, wall: 'top' },
    { row: 0, col: 1, wall: 'right' },
    { row: 1, col: 0, wall: 'bottom' },
    { row: 0, col: -1, wall: 'left' },
  ];

  for (const direction of shuffle(directions)) {
    const newRow = row + direction.row;
    const newCol = col + direction.col;

    if (
      newRow >= 0 &&
      newRow < numRows &&
      newCol >= 0 &&
      newCol < numCols &&
      !grid[newRow][newCol].visited
    ) {
      cell.walls[direction.wall] = false;
      grid[newRow][newCol].walls[oppositeWall(direction.wall)] = false;
      carveMaze(newRow, newCol);
    }
  }
}

carveMaze(0, 0);

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function oppositeWall(wall) {
  switch (wall) {
    case 'top':
      return 'bottom';
    case 'right':
      return 'left';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
  }
}

const player = {
  row: Math.floor(Math.random() * numRows),
  col: Math.floor(Math.random() * numCols),
};

const exit = {
  row: Math.floor(Math.random() * numRows),
  col: Math.floor(Math.random() * numCols),
};

function redraw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4; // Set the line width for thicker walls

  for (const row of grid) {
    for (const cell of row) {
      if (cell.walls.top) {
        ctx.beginPath();
        ctx.moveTo(cell.col * cellSize, cell.row * cellSize);
        ctx.lineTo((cell.col + 1) * cellSize, cell.row * cellSize);
        ctx.stroke();
      }
      if (cell.walls.right) {
        ctx.beginPath();
        ctx.moveTo((cell.col + 1) * cellSize, cell.row * cellSize);
        ctx.lineTo((cell.col + 1) * cellSize, (cell.row + 1) * cellSize);
        ctx.stroke();
      }
      if (cell.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(cell.col * cellSize, (cell.row + 1) * cellSize);
        ctx.lineTo((cell.col + 1) * cellSize, (cell.row + 1) * cellSize);
        ctx.stroke();
      }
      if (cell.walls.left) {
        ctx.beginPath();
        ctx.moveTo(cell.col * cellSize, cell.row * cellSize);
        ctx.lineTo(cell.col * cellSize, (cell.row + 1) * cellSize);
        ctx.stroke();
      }
    }
  }

  // Draw the player as a square
  ctx.fillStyle = 'red';
  ctx.fillRect(
    (player.col + 0.5) * cellSize - cellSize / 4,
    (player.row + 0.5) * cellSize - cellSize / 4,
    cellSize / 2,
    cellSize / 2
  );

  // Draw the exit as a square
  ctx.fillStyle = 'green';
  ctx.fillRect(
    (exit.col + 0.5) * cellSize - cellSize / 4,
    (exit.row + 0.5) * cellSize - cellSize / 4,
    cellSize / 2,
    cellSize / 2
  );
}

redraw();

document.addEventListener('keydown', (event) => {
  const key = event.key;
  const row = player.row;
  const col = player.col;

  if (key === 'ArrowUp' && !grid[row][col].walls.top) {
    player.row--;
  } else if (key === 'ArrowRight' && !grid[row][col].walls.right) {
    player.col++;
  } else if (key === 'ArrowDown' && !grid[row][col].walls.bottom) {
    player.row++;
  } else if (key === 'ArrowLeft' && !grid[row][col].walls.left) {
    player.col--;
  }

  redraw();

  if (player.row === exit.row && player.col === exit.col) {
    document.getElementById("gameTitle").innerText = "Biggest Win!";
    document.getElementById("gameTitle").style.color = "red";
  }
});