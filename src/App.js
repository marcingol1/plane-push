import * as THREE from "three";
import * as CANNON from "cannon";
import React, { useRef, useState } from "react";
import { Canvas, useThree, useRender, apply } from "react-three-fiber";
import { useCannon, Provider } from "./useCannon";
import { OrbitControls } from "./resources/OrbitControls";
import "./styles.css";

function Plane({ position }) {
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, body => {
    body.addShape(new CANNON.Plane());
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshPhongMaterial attach="material" color="#323247" />
    </mesh>
  );
}

function Box({ position }) {
  // Register box as a physics body with mass
  const ref = useCannon({ mass: 100000 }, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}

apply({ OrbitControls });

function Controls(props) {
  const ref = useRef();
  const { camera } = useThree();
  useRender(() => {
    ref.current.update();
  });

  return <orbitControls ref={ref} args={[camera]} {...props} />;
}

export default function App() {
  const { camera, mouse, raycaster } = useThree();
  const [boxes, setBoxes] = useState([
    [1, 0, 2],
    [2, 1, 2],
    [0, 0, 2],
    [-1, 1, 8],
    [-2, 2, 23],
    [2, -1, 13]
  ]);

  function addBox() {
    setBoxes([
      ...boxes,
      [
        Math.round(Math.random() * 100) - 55,
        Math.round(Math.random() * 100) - 55,
        50
      ]
    ]);
  }
  return (
    <div className="main">
      <Canvas
        camera={{ position: [0, 0, 100], type: "Perspective Camera" }}
        onCreated={({ gl }) => (
          (gl.shadowMap.enabled = true),
          (gl.shadowMap.type = THREE.PCFSoftShadowMap)
        )}
        onClick={addBox}
      >
        <Controls />
        <ambientLight intensity={0.7} />
        <spotLight
          intensity={0.6}
          position={[30, 30, 50]}
          angle={0.5}
          penumbra={0.1}
          castShadow
        />
        <Provider>
          <Plane position={[5, 5, 5]} />
          {boxes.map((box, index) => (
            <Box position={box} key={box + index} />
          ))}
        </Provider>
      </Canvas>
    </div>
  );
}
