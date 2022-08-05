import { Euler, Vector3 } from "three";
import {
  CrossRoad,
  CurvedRoad,
  StraightRoad,
  TJunctionRoad,
} from "../assets/roadkit";

export function Road({ position, materialGrid }) {
  const { x, y } = position;
  const patterns = {
    // Standalone
    GGGG: { model: StraightRoad, angle: 0 },

    //End of road.
    RGGG: { model: StraightRoad, angle: 90 },
    GRGG: { model: StraightRoad, angle: 0 },
    GGRG: { model: StraightRoad, angle: 90 },
    GGGR: { model: StraightRoad, angle: 0 },

    // Straight
    GRGR: { model: StraightRoad, angle: 0 },
    RGRG: { model: StraightRoad, angle: 90 },

    // Curve
    RRGG: { model: CurvedRoad, angle: 0 },
    GRRG: { model: CurvedRoad, angle: 270 },
    GGRR: { model: CurvedRoad, angle: 180 },
    RGGR: { model: CurvedRoad, angle: 90 },

    // T-junction
    RRRG: { model: TJunctionRoad, angle: 0 },
    GRRR: { model: TJunctionRoad, angle: 270 },
    RGRR: { model: TJunctionRoad, angle: 180 },
    RRGR: { model: TJunctionRoad, angle: 90 },

    // Crossroads
    RRRR: { model: CrossRoad, angle: 0 },
  };

  const neighbors = [
    materialGrid[position.y - 1][position.x],
    materialGrid[position.y][position.x + 1],
    materialGrid[position.y + 1][position.x],
    materialGrid[position.y][position.x - 1],
  ].join("");

  const [, { model, angle }] = Object.entries(patterns).find(
    ([pattern]) => pattern === neighbors
  ) ?? [null, { model: null, angle: 0 }];

  const rotation = new Euler(0, (Math.PI * angle) / 180, 0);

  const Model = model;

  return (props) => (
    <Model
      position={new Vector3(x, 0, y)}
      rotation={rotation}
      neighbors={neighbors}
      {...props}
    />
  );
}
