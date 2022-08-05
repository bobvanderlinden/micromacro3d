import { Object3DProps, PrimitiveProps, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { Group, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Model({ url, ...props }: { url: string } & Object3DProps) {
  if (!url) {
    return null;
  }
  const gltf = useLoader(GLTFLoader, url);
  const pivot = new Group();
  const model = gltf.scene.clone(true);
  pivot.add(model);
  model.scale.multiplyScalar(1 / 3);
  model.position.add(new Vector3(-0.5, 0, 0.5));
  return (
    <Suspense fallback={null}>
      <primitive object={pivot} {...props} />
    </Suspense>
  );
}
