import { Vector3 } from "three";
import grassUrl from "../assets/models/roads/roadTile_163.gltf?url";
import { Model } from "../components/Model";

export function Grass({ position, materialGrid }) {
  const { x, y } = position;
  return (props) => (
    <Model url={grassUrl} position={new Vector3(x, 0, y)} {...props} />
  );
}
