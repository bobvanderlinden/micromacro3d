import { Vector3 } from "three";

export function ModelPicker({
  models,
  spacing,
  value,
  onChange,
}: {
  models: any[];
  spacing?: number;
  value: any;
  onChange: (e: ChangeEvent<Object3D>) => void;
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
