import { Vector3 } from "three";
import { Model } from "./Model";

export function ModelGallery({
  modelUrls,
  spacing = 1.25,
}: {
  modelUrls: string[];
  spacing?: number;
}) {
  const horizontalCount = Math.floor(Math.sqrt(modelUrls.length));
  const size = horizontalCount * spacing;
  const offset = new Vector3(-size, 0, -size).multiplyScalar(0.5);
  return (
    <>
      {modelUrls.map((modelUrl, index) => (
        <mesh
          key={index}
          name={modelUrl}
          position={new Vector3(
            (index / horizontalCount) | 0,
            0,
            index % horizontalCount
          )
            .multiplyScalar(spacing)
            .add(offset)}
        >
          <Model url={modelUrl} />
        </mesh>
      ))}
    </>
  );
}
