import { useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  const scene = gltf.scene;
  return (
    <Suspense fallback={null}>
      <primitive name={scene.name} object={scene} />
    </Suspense>
  );
}
