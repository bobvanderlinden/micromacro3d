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
  private lookup: Map<string, number> = new Map();

  hash({ cell, rotation, neighbor }: CompatiblityOracleEntry<TCell>) {
    return JSON.stringify({ cell, rotation, neighbor });
  }

  add(entry: CompatiblityOracleEntry<TCell>): void {
    const hash = this.hash(entry);
    const previousValue = this.lookup.get(hash) ?? 0;
    this.lookup.set(hash, previousValue + 1);
  }

  delete(entry: CompatiblityOracleEntry<TCell>) {
    const hash = this.hash(entry);
    this.lookup.delete(hash);
  }

  get(entry: CompatiblityOracleEntry<TCell>): number {
    return this.lookup.get(this.hash(entry)) ?? 0;
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

type Combinations<T> = T[];

function isCollapsed(combinations: Combinations<any>) {
  return combinations.length === 1;
}

function sum(items: number[]) {
  return items.reduce((a, b) => a + b, 0);
}

type WaveFunctionCollapseOptions<TCell> = {
  grid: Grid<Combinations<TCell>>;
  oracle: CompatiblityOracle<TCell>;
  rnd: (min: number, max: number) => number;
};

export class WaveFunctionCollapse<TCell>
  implements WaveFunctionCollapseOptions<TCell>
{
  public grid: Grid<Combinations<TCell>>;
  public oracle: CompatiblityOracle<TCell>;
  public rnd: (min: number, max: number) => number;
  constructor(options: WaveFunctionCollapseOptions<TCell>) {
    Object.assign(this, options);
  }

  pick<T>(items: T[]): T {
    return items[this.rnd(0, items.length - 1)];
  }

  pickWeighted<T>(cellScores: [T, number][]): T {
    const totalScore = sum(cellScores.map(([_, score]) => score));
    let pickedScore = this.rnd(0, totalScore);
    while (true) {
      const [cell, score] = cellScores.pop();
      pickedScore -= score;
      if (pickedScore <= 0) {
        return cell;
      }
    }
  }

  pickCell(coords: Coords): TCell {
    const combinations = this.grid.getCell(coords);
    const cellScores = combinations.map((cell) => {
      const score = sum(
        rotations.map((rotation) => {
          const neighborCoords = add(coords, rotationCoord(rotation));
          return sum(
            this.grid
              .getCell(neighborCoords)
              .map((neighbor) => this.oracle.get({ cell, rotation, neighbor }))
          );
        })
      );
      return [cell, score] as [TCell, number];
    });

    return this.pickWeighted(cellScores);
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
    const chosen = this.pickCell(coords);
    debug("collapsed", coords, "to", chosen);
    this.collapseTo(coords, chosen);
  }

  collapseTo(coords: Coords, cell: TCell) {
    this.grid.setCell(coords, [cell]);
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

        // Skip this neighbor if it is already collapsed.
        if (isCollapsed(neighborPossibilities)) {
          continue;
        }

        // Remove all combinations that aren't possible in the neighboring cell.
        const newNeighborPossiblities = neighborPossibilities.filter(
          (neighborPossibility) =>
            possibilities.some(
              (cell) =>
                this.oracle.get({
                  cell,
                  rotation,
                  neighbor: neighborPossibility,
                }) > 0
            )
        );

        // We found a situation that we couldn't resolve with the currently picked conditions.
        // We push this coord to be handled at a later time in the hope it can be handled then.
        // We won't apply the changes, as that would result in 0 combinations for this neighboring cell.
        if (newNeighborPossiblities.length === 0) {
          stack.push(neighborCoords);
          continue;
        }

        // When there was no possibility removed, we can just continue to the next neighbor.
        if (newNeighborPossiblities.length === neighborPossibilities.length) {
          continue;
        }

        this.grid.setCell(neighborCoords, newNeighborPossiblities);
        stack.push(neighborCoords);
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

  static fromGrid<TCell>(
    sourceGrid: Grid<TCell>,
    options: Omit<WaveFunctionCollapseOptions<TCell>, "grid" | "oracle">
  ): WaveFunctionCollapse<TCell> {
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

    return new WaveFunctionCollapse<TCell>({ grid, oracle, ...options });
  }
}

export function start(sourceGrid: Grid): Grid {
  const wfc = WaveFunctionCollapse.fromGrid<CellData>(sourceGrid, {
    rnd: (min, max) => min + Math.round((max - min) * Math.random()),
  });
  return wfc.run();
}
