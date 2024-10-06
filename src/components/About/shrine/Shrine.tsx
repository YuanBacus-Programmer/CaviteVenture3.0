import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

const MODEL_PATH = '/shrine.glb';

const Model: React.FC = () => {
  const { scene } = useGLTF(MODEL_PATH);

  return <primitive object={scene} scale={new Vector3(1, 1, 1)} position={new Vector3(0, -1, 0)} />;
};

const ThreeModel: React.FC = () => {
  return (
    <Canvas style={{ height: '100vh', width: '60%' }} camera={{ position: [10, 10, 45], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={3} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls minDistance={10} maxDistance={100} />
    </Canvas>
  );
};

export default ThreeModel;
