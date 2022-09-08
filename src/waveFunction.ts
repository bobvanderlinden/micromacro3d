import { CellData, Coords, Grid, initGridData, Rotation } from "./Grid";

function debug(...args) {
  // console.debug(...args);
}

const rotations: [0, 1, 2, 3] = [0, 1, 2, 3];

function uniqueBy<T, TKey = string>(items: T[], keyFn: (item: T) => TKey): T[] {
  const m = new Map();
  for (const item of items) {
    m.set(keyFn(item), item);
  }
  return [...m.values()];
}

function assert(condition, messageFn) {
  if (!condition) {
    const message = typeof messageFn === "function" ? messageFn() : messageFn;
    throw new Error(`Assertion failed: ${message}`);
  }
}

type CompatiblityOracleEntry<TCell> = {
  cell: TCell;
  rotation: Rotation;
  neighbor: TCell;
};
export class CompatiblityOracle<TCell> {
  private lookup: Set<string> = new Set();

  hash({ cell, rotation, neighbor }: CompatiblityOracleEntry<TCell>) {
    return JSON.stringify({ cell, rotation, neighbor });
  }

  add(entry: CompatiblityOracleEntry<TCell>): void {
    this.lookup.add(this.hash(entry));
  }

  has(entry: CompatiblityOracleEntry<TCell>): boolean {
    return this.lookup.has(this.hash(entry));
  }

  addGrid(grid: Grid<TCell>) {
    for (const { x, y, cell } of grid) {
      for (const rotation of rotations) {
        const neighbor = grid.getCell(add([x, y], rotationCoord(rotation)));
        this.add({ cell, rotation, neighbor });
      }
    }
  }

  *[Symbol.iterator]() {
    for (const item of this.lookup.values()) {
      yield item;
    }
  }
}

const rotationCoords: Coords[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function rotationCoord(rotation: Rotation): Coords {
  return rotationCoords[rotation];
}

function add([ax, ay]: Coords, [bx, by]: Coords): Coords {
  return [ax + bx, ay + by];
}

function remove<T>(items: T[], item: T) {
  const index = items.indexOf(item);
  items.splice(index, 1);
}

type Combinations<T> = T[];

function isCollapsed(combinations: Combinations<any>) {
  return combinations.length === 1;
}

export class WaveFunctionCollapse<TCell> {
  constructor(
    public grid: Grid<Combinations<TCell>>,
    public oracle: CompatiblityOracle<TCell>,
    public rnd: (min: number, max: number) => number = (min, max) => min
  ) {}

  pick<T>(items: T[]): T {
    return items[this.rnd(0, items.length - 1)];
  }

  findMinimumEntropy() {
    let min = Infinity;
    let minCoords = [];
    for (const { x, y, cell } of this.grid) {
      if (cell.length === 1) {
        // Cell is already collapsed
        continue;
      } else if (cell.length < min) {
        min = cell.length;
        minCoords = [[x, y]];
      } else if (cell.length === min) {
        minCoords.push([x, y]);
      }
    }
    return minCoords.length ? this.pick(minCoords) : null;
  }

  collapse(coords: Coords) {
    const combinations = this.grid.getCell(coords);
    const chosen = this.pick(combinations);
    debug("collapsed", coords, "to", chosen);
    this.grid.setCell(coords, [chosen]);
  }

  propagate(startingCoords: Coords) {
    const stack = [startingCoords];
    while (stack.length > 0) {
      const coords = stack.pop();
      debug("propagating", coords);

      const possibilities = this.grid.getCell(coords);
      for (const rotation of rotations) {
        const neighborCoords = add(coords, rotationCoord(rotation));
        const neighborPossibilities = this.grid.getCell(neighborCoords);
        if (isCollapsed(neighborPossibilities)) {
          continue;
        }
        for (const neighborPossibility of [...neighborPossibilities]) {
          const isPossible = possibilities.some((cell) =>
            this.oracle.has({ cell, rotation, neighbor: neighborPossibility })
          );
          if (!isPossible) {
            assert(
              neighborPossibilities.length > 1,
              `neighborPossibilities.length is ${neighborPossibilities.length}`
            );
            remove(neighborPossibilities, neighborPossibility);
            stack.push(neighborCoords);
          }
        }
      }
    }
  }

  isFullyCollapsed() {
    return this.grid.data.cells.every(isCollapsed);
  }

  step() {
    const coords = this.findMinimumEntropy();
    debug("findMinimumEntropy", coords, this.grid.getCell(coords));
    this.collapse(coords);
    this.propagate(coords);
  }

  run() {
    while (!this.isFullyCollapsed()) {
      this.step();
    }

    return new Grid({
      ...this.grid.data,
      cells: this.grid.data.cells.map(([possibility]) => possibility),
    });
  }

  static fromGrid<TCell>(sourceGrid: Grid<TCell>): WaveFunctionCollapse<TCell> {
    const oracle = new CompatiblityOracle();
    oracle.addGrid(sourceGrid);

    // Fetch all possible cells from the map.
    const cellDatas = uniqueBy(sourceGrid.data.cells, (cell) =>
      JSON.stringify(cell)
    );

    const grid = new Grid<Combinations<TCell>>(
      initGridData(sourceGrid.data.width, sourceGrid.data.height, () => [
        ...cellDatas,
      ])
    );

    return new WaveFunctionCollapse<TCell>(grid, oracle);
  }
}

export function start(sourceGrid: Grid): Grid {
  const wfc = WaveFunctionCollapse.fromGrid<CellData>(sourceGrid);
  wfc.rnd = (min, max) => min + Math.round((max - min) * Math.random());
  return wfc.run();
}
