import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Object3D, Raycaster } from "three";
import { useAnimationFrame } from "./useAnimationFrame";

function rayCast({ scene, rayCaster, mouse, camera }) {
  rayCaster.setFromCamera(mouse, camera);

  const results = rayCaster.intersectObjects(scene.children);
  if (results.length === 0) {
    return null;
  }

  let subObject = results[0].object;
  const parents = [];
  while (subObject.parent && subObject.type !== "Scene") {
    parents.unshift(subObject);
    subObject = subObject.parent;
  }

  return parents[0];
}

export function PickHelper() {
  const [rayCaster] = useState(() => new Raycaster());
  const { mouse, scene, camera } = useThree();
  const pickedObjectRef = useRef<Object3D>();
  useAnimationFrame(() => {
    const pickedObject = rayCast({ scene, rayCaster, mouse, camera });

    if (pickedObject === pickedObjectRef.current) {
      return;
    }

    const previousPickedObject = pickedObjectRef.current;
    if (previousPickedObject) {
      previousPickedObject.scale.set(1, 1, 1);
    }

    if (pickedObject) {
      console.log(pickedObject.name);
      pickedObject.scale.set(1.5, 1.5, 1.5);
    }

    pickedObjectRef.current = pickedObject;
  });
  return null;
}
