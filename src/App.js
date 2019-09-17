/** POC for three-fiber and cannon (a 3d physics lib)
 *
 *  useCannon is a custom hook that lets you link a physics body to a threejs
 *  mesh with zero effort. It will automatically update the mesh with the
 *  correct positioning.
 *
 *  When components with useCannon mount they are known to cannons world, when
 *  they unmount, they'll remove themselves from physics processing.
 *
 *  Check out three-fiber here: https://github.com/drcmda/rea sct-three-fiber
 */

import * as THREE from "three";
import * as CANNON from "cannon";
import React, { useEffect, useState } from "react";
import { Canvas } from "react-three-fiber";
import { useCannon, Provider } from "./useCannon";
import "./styles.css";

function Plane({ position }) {
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, body => {
    body.addShape(new CANNON.Plane());
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#272727" />
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

export default function App() {
  const [showPlane, set] = useState(true);
  // When React removes (unmounts) the upper plane after 5 sec, objects should drop ...
  // This may seem like magic, but as the plane unmounts it removes itself from cannon and that's that
  useEffect(() => void setTimeout(() => set(false), 5000), []);
  return (
    <div className="main">
      <Canvas
        camera={{ position: [0, 0, 15] }}
        onCreated={({ gl }) => (
          (gl.shadowMap.enabled = true),
          (gl.shadowMap.type = THREE.PCFSoftShadowMap)
        )}
        onClick={event => console.log(event)}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.6}
          position={[30, 30, 50]}
          angle={0.2}
          penumbra={1}
          castShadow
        />
        <Provider>
          <Plane position={[0, 0, -10]} />
          {showPlane && <Plane position={[0, 0, 0]} />}
          <Box position={[1, 0, 2]} />
          <Box position={[2, 1, 2]} />
          <Box position={[0, 0, 2]} />
          <Box position={[-1, 1, 8]} />
          <Box position={[-2, 2, 23]} />
          <Box position={[2, -1, 13]} />
          {!showPlane && <Box position={[0.5, 1.0, 20]} />}
        </Provider>
      </Canvas>
    </div>
  );
}
