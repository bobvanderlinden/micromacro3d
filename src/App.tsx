import { Suspense, useEffect, useRef, useState } from "react";
import { useLoader, useThree, _roots } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { padStart, range } from "lodash";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowHelper,
  AxesHelper,
  Euler,
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
  const { mouse, scene, camera } = useThree((state) => ({
    mouse: state.mouse,
    scene: state.scene,
    camera: state.camera,
  }));
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

    controls.minDistance = 3;
    controls.maxDistance = 20;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

function App() {
  const frustumSize = 10;
  const aspect = window.innerWidth / window.innerHeight;

  return (
    <div className="App">
      <Canvas
        camera={
          new OrthographicCamera(
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000
          )
        }
      >
        <CameraController />
        <PickHelper />
        <primitive object={new AxesHelper(10)} />
        <ambientLight intensity={0.1} />
        <hemisphereLight intensity={0.2} position={new Vector3(0, 50, 0)} />
        <directionalLight
          intensity={0.2}
          position={new Vector3(-1, 1.75, 1).multiplyScalar(10)}
        />
        <ModelGallery modelUrls={roadTileUrls} />
      </Canvas>
    </div>
  );
}

export default App;
