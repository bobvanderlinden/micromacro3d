import {
  roadTile162 as roadUrl,
  roadTile153 as roadCurveUrl,
  roadTile150 as roadTJunctionUrl,
  roadTile141 as roadCrossroadsUrl,
  roadTile163 as grassUrl,
} from "./urls";
import { Model } from "../../components/Model";

export function RoadkitModel({ url, ...props }) {
  return (
    <group {...props}>
      <Model url={url} scale={1 / 3} position={[-0.5, 0, 0.5]} />
    </group>
  );
}

export function StraightRoad(props) {
  return <RoadkitModel url={roadUrl} {...props} />;
}

export function CurvedRoad(props) {
  return <RoadkitModel url={roadCurveUrl} {...props} />;
}

export function TJunctionRoad(props) {
  return <RoadkitModel url={roadTJunctionUrl} {...props} />;
}

export function CrossRoad(props) {
  return <RoadkitModel url={roadCrossroadsUrl} {...props} />;
}

export function Grass(props) {
  return <RoadkitModel url={grassUrl} {...props} />;
}
