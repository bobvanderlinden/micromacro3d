export type TileData = {
  url: string;
};
export type CellData = {
  tile: TileData;
  rotation: Rotation;
};
export type Rotation = 0 | 1 | 2 | 3;
type GridData<TCell = CellData> = {
  width: number;
  height: number;
  cells: (TCell | null)[];
};
function initGridData(
  width: number,
  height: number,
  fillCell: CellData | null
): GridData {
  return {
    width,
    height,
    cells: new Array(width * height).fill(fillCell),
  };
}
export type Coords = [number, number];
export class Grid<TCell = CellData> {
  constructor(public data: GridData<TCell>) {}

  getCell([x, y]: Coords) {
    return this.data.cells[y * this.data.width + x];
  }

  setCell([x, y]: Coords, cell: TCell) {
    this.data.cells[y * this.data.width + x] = cell;
  }

  resize([width, height]: Coords, emptyCell: TCell): Grid {
    const newGrid = new Grid({
      ...this.data,
      width,
      height,
      cells: new Array(width * height),
    });
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const cell =
          x < this.data.width && y < this.data.height
            ? this.getCell([x, y])
            : emptyCell;
        newGrid.setCell([x, y], cell);
      }
    }
    return newGrid;
  }

  *[Symbol.iterator](): Iterator<{ x: number; y: number; cell: TCell }> {
    for (let y = 0; y < this.data.height; y++) {
      for (let x = 0; x < this.data.width; x++) {
        const cell = this.getCell([x, y]);
        if (cell) {
          yield { x, y, cell: this.getCell([x, y]) };
        }
      }
    }
  }
}
