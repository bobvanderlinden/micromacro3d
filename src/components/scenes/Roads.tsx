import { Vector2 } from "three";
import { Grass } from "../../materials/Grass";
import { Road } from "../../materials/Road";

function parseMap(map: string) {
  return map
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(""));
}

const map = `
  GGGGGGG
  GRRRGGG
  GRGRGGG
  GRRRRRG
  GRGRGRG
  GRRRRRG
  GRGGRGG
  GRRRRGG
  GGGGGGG
`;

const materialLookup = {
  G: Grass,
  R: Road,
};

const materialGrid = parseMap(map);

const grid = materialGrid.map((row, y) =>
  row.map((materialName, x) => {
    const material = materialLookup[materialName];
    return material({ position: new Vector2(x, y), materialGrid });
  })
);

export function Roads() {
  return (
    <scene>
      {grid.flatMap((row, y) =>
        row.map((Tile, x) => <Tile key={`${x}-${y}`} />)
      )}
    </scene>
  );
}
