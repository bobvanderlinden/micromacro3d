import { useState } from "react";
import { _roots } from "@react-three/fiber";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import { Gallery } from "./components/scenes/Gallery";
import { CameraController } from "./CameraController";
import { PickHelper } from "./PickHelper";
import { Roads } from "./components/scenes/Roads";
import { Buildings } from "./components/scenes/Buildings";
import { Editor } from "./components/scenes/Editor";
import { OrbitControls } from "@react-three/drei";

const scenes = {
  Buildings,
  Roads,
  Gallery,
  Editor,
};

function App() {
  const [scene, setScene] = useState(() => Object.keys(scenes)[0]);
  const Scene = scenes[scene];
  return (
    <>
      <div className="toolbar">
        <select value={scene} onChange={(e) => setScene(e.target.value)}>
          {Object.entries(scenes).map(([key, value]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <Canvas
        gl={{
          antialias: true,
          precision: "highp",
        }}
        orthographic={true}
        camera={{
          position: [2, 3, 2],
          zoom: 300,
        }}
      >
        <scene scale={new Vector3(1, 1, 1).multiplyScalar(0.1)}>
          {/* <ambientLight intensity={0.05} /> */}
          <hemisphereLight intensity={0.21} position={new Vector3(0, 50, 0)} />
          <directionalLight
            intensity={0.21}
            position={new Vector3(0, 1.75, 1).multiplyScalar(10)}
          />
          <pointLight intensity={0.1} position={new Vector3(0, 10, 0)} />
          <Scene />
        </scene>
        <OrbitControls
          makeDefault
          dampingFactor={0.2}
          minDistance={3}
          maxDistance={20}
          enableDamping={true}
          enablePan={true}
          enableRotate={true}
          enableZoom={true}
          reverseOrbit={false}
        />
      </Canvas>
    </>
  );
}

export default App;
