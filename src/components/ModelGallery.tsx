import { Vector3 } from "three";
import { Model } from "./Model";

export function ModelGallery({
  models,
  spacing,
}: {
  models: any[];
  spacing?: number;
}) {
  const horizontalCount = Math.floor(Math.sqrt(models.length));
  const size = horizontalCount * spacing;
  const offset = new Vector3(-size, 0, -size).multiplyScalar(0.5);
  return (
    <>
      {models.map((Model, index) => (
        <Model
          key={index}
          position={new Vector3(
            (index / horizontalCount) | 0,
            0,
            index % horizontalCount
          )
            .multiplyScalar(spacing)
            .add(offset)}
        />
      ))}
    </>
  );
}
