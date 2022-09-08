import {
  CompatiblityOracle,
  start,
  WaveFunctionCollapse,
} from "./waveFunction";
import { describe, expect, test } from "vitest";
import { CellData, Grid } from "./Grid";

function rnd(min: number, max: number): number {
  return min;
}

function stringifyGrid<TCell>(
  grid: Grid<TCell>,
  stringifyCell = (s) => JSON.stringify(s)
): string {
  let result = "";
  for (let y = 0; y < grid.data.height; y++) {
    for (let x = 0; x < grid.data.width; x++) {
      const cell = grid.getCell([x, y]);
      result += stringifyCell(cell);
    }
    result += "\n";
  }
  return result;
}

describe("CompatiblityOracle", () => {
  const a = "a";
  const b = "b";
  test("can find added case", () => {
    const oracle = new CompatiblityOracle<string>();
    oracle.add({ cell: a, rotation: 0, neighbor: b });
    expect(oracle.get({ cell: a, rotation: 0, neighbor: b })).toBe(1);
  });
  test("can find added case2", () => {
    const cell = "a";
    const neighbor = "b";
    const oracle = new CompatiblityOracle();
    oracle.add({ cell, rotation: 0, neighbor });
    expect(oracle.get({ cell, rotation: 0, neighbor })).toBe(1);
  });
  test("cannot find values that were not added", () => {
    const oracle = new CompatiblityOracle();
    oracle.add({ cell: a, rotation: 0, neighbor: b });
    expect(oracle.get({ cell: a, rotation: 1, neighbor: b })).toBe(0);
  });
  test("can find case from grid", () => {
    const oracle = new CompatiblityOracle();
    oracle.addGrid(
      new Grid({
        width: 2,
        height: 2,
        cells: [a, b, b, a],
      })
    );
    expect(oracle.get({ cell: a, rotation: 0, neighbor: b })).toBe(2);
    expect(oracle.get({ cell: b, rotation: 0, neighbor: a })).toBe(2);
    expect(oracle.get({ cell: a, rotation: 1, neighbor: b })).toBe(2);
    expect(oracle.get({ cell: a, rotation: 2, neighbor: b })).toBe(2);
    expect(oracle.get({ cell: a, rotation: 3, neighbor: b })).toBe(2);
    expect(oracle.get({ cell: a, rotation: 0, neighbor: a })).toBe(0);
    expect(oracle.get({ cell: a, rotation: 1, neighbor: a })).toBe(0);
    expect(oracle.get({ cell: a, rotation: 2, neighbor: a })).toBe(0);
    expect(oracle.get({ cell: a, rotation: 3, neighbor: a })).toBe(0);
  });
});

describe("WaveFunctionCollapse", () => {
  const gridLock = new Grid<string>({
    width: 3,
    height: 3,
    cells: ["a", "b", "c", "b", "c", "a", "c", "a", "b"],
  });
  const centerGrid = new Grid<string>({
    width: 3,
    height: 3,
    cells: ["a", "a", "a", "a", "b", "a", "a", "a", "a"],
  });
  function stringify(grid) {
    return "\n" + stringifyGrid(grid, (cell) => `[${cell.join("")}]`);
  }
  test("fromGrid initializes with all combinations", () => {
    const wfc = WaveFunctionCollapse.fromGrid(gridLock, { rnd });
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
    "
    [abc][abc][abc]
    [abc][abc][abc]
    [abc][abc][abc]
    "
  `);
  });
  test("collapses gridLock in one step", () => {
    const wfc = WaveFunctionCollapse.fromGrid(gridLock, { rnd });
    expect(wfc.isFullyCollapsed()).toBe(false);
    wfc.step();
    expect(wfc.isFullyCollapsed()).toBe(true);
  });
  test("collapses centerGrid in multiple steps", () => {
    const wfc = WaveFunctionCollapse.fromGrid(centerGrid, { rnd });
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [ab][ab][ab]
      [ab][ab][ab]
      [ab][ab][ab]
      "
    `);
    expect(wfc.isFullyCollapsed()).toBe(false);
    expect(wfc.step()).toBe(true);
    expect(wfc.isFullyCollapsed()).toBe(false);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [b][a][a]
      [a][ab][ab]
      [a][ab][ab]
      "
    `);
    expect(wfc.step()).toBe(true);
    expect(wfc.isFullyCollapsed()).toBe(false);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [b][a][a]
      [a][b][a]
      [a][a][ab]
      "
    `);
    wfc.run();
    expect(wfc.isFullyCollapsed()).toBe(true);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [b][a][a]
      [a][b][a]
      [a][a][b]
      "
    `);
  });
});
