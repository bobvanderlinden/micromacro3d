import { useEffect, useRef, useState } from "react";
import { useThree, _roots } from "@react-three/fiber";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import {
  AxesHelper,
  Object3D,
  OrthographicCamera,
  Raycaster,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ModelGallery } from "./ModelGallery";
import { useAnimationFrame } from "./useAnimationFrame";

const roadTileUrls = Object.entries(
  import.meta.glob("./assets/models/roads/roadTile_*.gltf", {
    as: "url",
    eager: true,
  })
).map(([key, value]) => value);

function PickHelper() {
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

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.dampingFactor = 0.5;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

function App() {
  return (
    <Canvas
      gl={{
        antialias: true,
        precision: "highp",
      }}
      orthographic={true}
      camera={{
        position: [2, 3, 2],
        zoom: 100,
      }}
    >
      <scene scale={new Vector3(1, 1, 1).multiplyScalar(0.1)}>
        <CameraController />
        <PickHelper />
        {/* <ambientLight intensity={0.05} /> */}
        <hemisphereLight intensity={0.21} position={new Vector3(0, 50, 0)} />
        <directionalLight
          intensity={0.21}
          position={new Vector3(-1, 1.75, 1).multiplyScalar(10)}
        />
        <ModelGallery modelUrls={roadTileUrls} />
      </scene>
    </Canvas>
  );
}

export default App;
