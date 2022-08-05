import { Vector3 } from "three";
import { Grass as GrassModel } from "../assets/roadkit";

export function Grass({ position, materialGrid }) {
  const { x, y } = position;
  return (props) => <GrassModel position={new Vector3(x, 0, y)} {...props} />;
}
