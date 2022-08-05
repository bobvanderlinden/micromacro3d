import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Object3D, Raycaster } from "three";
import { useAnimationFrame } from "./useAnimationFrame";

export function PickHelper() {
  const [rayCaster] = useState(() => new Raycaster());
  const { mouse, scene, camera } = useThree();
  const pickedObjectRef = useRef<Object3D>();
  useAnimationFrame(() => {
    rayCaster.setFromCamera(mouse, camera);

    const results = rayCaster.intersectObjects(scene.children);
    if (results.length > 0) {
      let subObject = results[0].object;
      const parents = [];
      while (subObject.parent && subObject.type !== "Scene") {
        parents.unshift(subObject);
        subObject = subObject.parent;
      }

      const pickedObject = parents[0];

      if (pickedObject === undefined) {
        return;
      }

      if (pickedObject === pickedObjectRef.current) {
        return;
      }

      const previousPickedObject = pickedObjectRef.current;
      if (previousPickedObject) {
        previousPickedObject.scale.set(1, 1, 1);
      }
      console.log(pickedObject.name);
      pickedObject.scale.set(1.5, 1.5, 1.5);
      pickedObjectRef.current = pickedObject;
    }
  });
  return null;
}
