import {
  CompatiblityOracle,
  start,
  WaveFunctionCollapse,
} from "./waveFunction";
import { describe, expect, test } from "vitest";
import { CellData, Grid } from "./Grid";

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
    expect(oracle.has({ cell: a, rotation: 0, neighbor: b })).toBe(true);
  });
  test("can find added case2", () => {
    const cell = "a";
    const neighbor = "b";
    const oracle = new CompatiblityOracle();
    oracle.add({ cell, rotation: 0, neighbor });
    expect(oracle.has({ cell, rotation: 0, neighbor })).toBe(true);
  });
  test("cannot find values that were not added", () => {
    const oracle = new CompatiblityOracle();
    oracle.add({ cell: a, rotation: 0, neighbor: b });
    expect(oracle.has({ cell: a, rotation: 1, neighbor: b })).toBe(false);
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
    expect(oracle.has({ cell: a, rotation: 0, neighbor: b })).toBe(true);
    expect(oracle.has({ cell: b, rotation: 0, neighbor: a })).toBe(true);
    expect(oracle.has({ cell: a, rotation: 1, neighbor: b })).toBe(true);
    expect(oracle.has({ cell: a, rotation: 2, neighbor: b })).toBe(true);
    expect(oracle.has({ cell: a, rotation: 3, neighbor: b })).toBe(true);
    expect(oracle.has({ cell: a, rotation: 0, neighbor: a })).toBe(false);
    expect(oracle.has({ cell: a, rotation: 1, neighbor: a })).toBe(false);
    expect(oracle.has({ cell: a, rotation: 2, neighbor: a })).toBe(false);
    expect(oracle.has({ cell: a, rotation: 3, neighbor: a })).toBe(false);
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
    const wfc = WaveFunctionCollapse.fromGrid(gridLock);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
    "
    [abc][abc][abc]
    [abc][abc][abc]
    [abc][abc][abc]
    "
  `);
  });
  test("collapses gridLock in one step", () => {
    const wfc = WaveFunctionCollapse.fromGrid(gridLock);
    expect(wfc.isFullyCollapsed()).toBe(false);
    wfc.step();
    expect(wfc.isFullyCollapsed()).toBe(true);
  });
  test("collapses centerGrid in multiple steps", () => {
    const wfc = WaveFunctionCollapse.fromGrid(centerGrid);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [ab][ab][ab]
      [ab][ab][ab]
      [ab][ab][ab]
      "
    `);
    expect(wfc.isFullyCollapsed()).toBe(false);
    wfc.step();
    expect(wfc.isFullyCollapsed()).toBe(false);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [a][ab][ab]
      [ab][ab][ab]
      [ab][ab][ab]
      "
    `);
    wfc.step();
    expect(wfc.isFullyCollapsed()).toBe(false);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [a][a][ab]
      [ab][ab][ab]
      [ab][ab][ab]
      "
    `);
    wfc.run();
    expect(wfc.isFullyCollapsed()).toBe(true);
    expect(stringify(wfc.grid)).toMatchInlineSnapshot(`
      "
      [a][a][a]
      [a][a][a]
      [a][a][a]
      "
    `);
  });
});
