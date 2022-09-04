import React from "react";
import { Vector3 } from "three";
import { Plane } from "@react-three/drei";

export function Gallery({
  children,
  spacing,
}: {
  children: any[];
  spacing?: number;
}) {
  const horizontalCount = Math.floor(Math.sqrt(children.length));
  const size = horizontalCount * spacing;
  const offset = new Vector3(-size, 0, -size).multiplyScalar(0.5);
  return (
    <>
      <Plane
        scale={[size + spacing, size + spacing, 1]}
        rotation={[Math.PI * -0.5, 0, 0]}
      >
        <meshBasicMaterial transparent color="#333" opacity={0.5} />
      </Plane>
      {React.Children.map(children, (child, index) => (
        <group
          position={new Vector3(
            (index / horizontalCount) | 0,
            0,
            index % horizontalCount
          )
            .multiplyScalar(spacing)
            .add(offset)}
        >
          {child}
        </group>
      ))}
    </>
  );
}
