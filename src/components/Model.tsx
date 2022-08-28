import { Object3DProps, PrimitiveProps, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { Group, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Model({ url, ...props }: { url: string } & Object3DProps) {
  if (!url) {
    return null;
  }
  const gltf = useLoader(GLTFLoader, url);
  const model = gltf.scene.clone(true);
  (model as any).url = url;
  return (
    <Suspense fallback={null}>
      <primitive object={model} {...props} />
    </Suspense>
  );
}
