export type TileData = {
  name: string;
};
export type CellData = {
  tile: TileData;
  rotation: Rotation;
};
export type Rotation = 0 | 1 | 2 | 3;
export type GridData<TCell = CellData> = {
  width: number;
  height: number;
  cells: (TCell | null)[];
};
export function initGridData<TCell = CellData>(
  width: number,
  height: number,
  fillCell: (coords: Coords, index: number) => TCell | null
): GridData<TCell> {
  const cells = new Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = x + y * width;
      cells[index] = fillCell([x, y], index);
    }
  }
  return {
    width,
    height,
    cells,
  };
}
export type Coords = [number, number];
export class Grid<TCell = CellData> {
  constructor(public data: GridData<TCell>) {}

  getCell([x, y]: Coords) {
    x = (x + this.data.width) % this.data.width;
    y = (y + this.data.height) % this.data.height;
    return this.data.cells[y * this.data.width + x];
  }

  setCell([x, y]: Coords, cell: TCell) {
    x = (x + this.data.width) % this.data.width;
    y = (y + this.data.height) % this.data.height;
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

  clone() {
    return new Grid<TCell>({ ...this.data, cells: [...this.data.cells] });
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
