import { Euler, Vector3 } from "three";
import roadUrl from "../assets/models/roads/roadTile_162.gltf?url";
import roadCurveUrl from "../assets/models/roads/roadTile_153.gltf?url";
import roadTJunctionUrl from "../assets/models/roads/roadTile_150.gltf?url";
import roadCrossroadsUrl from "../assets/models/roads/roadTile_141.gltf?url";
import { Model } from "../components/Model";

export function Road({ position, materialGrid }) {
  const { x, y } = position;
  const patterns = {
    // Standalone
    GGGG: { url: roadUrl, angle: 0 },

    //
    RGGG: { url: roadUrl, angle: 90 },
    GRGG: { url: roadUrl, angle: 0 },
    GGRG: { url: roadUrl, angle: 90 },
    GGGR: { url: roadUrl, angle: 0 },

    // Straight
    GRGR: { url: roadUrl, angle: 0 },
    RGRG: { url: roadUrl, angle: 90 },

    // Curve
    RRGG: { url: roadCurveUrl, angle: 0 },
    GRRG: { url: roadCurveUrl, angle: 270 },
    GGRR: { url: roadCurveUrl, angle: 180 },
    RGGR: { url: roadCurveUrl, angle: 90 },

    // T-junction
    RRRG: { url: roadTJunctionUrl, angle: 0 },
    GRRR: { url: roadTJunctionUrl, angle: 270 },
    RGRR: { url: roadTJunctionUrl, angle: 180 },
    RRGR: { url: roadTJunctionUrl, angle: 90 },

    // Crossroads
    RRRR: { url: roadCrossroadsUrl, angle: 0 },
  };

  const neighbors = [
    materialGrid[position.y - 1][position.x],
    materialGrid[position.y][position.x + 1],
    materialGrid[position.y + 1][position.x],
    materialGrid[position.y][position.x - 1],
  ].join("");

  const [, { url, angle }] = Object.entries(patterns).find(
    ([pattern]) => pattern === neighbors
  ) ?? [null, { url: null, angle: 0 }];

  const rotation = new Euler(0, (Math.PI * angle) / 180, 0);

  return (props) => (
    <Model
      url={url}
      position={new Vector3(x, 0, y)}
      rotation={rotation}
      neighbors={neighbors}
      {...props}
    />
  );
}
