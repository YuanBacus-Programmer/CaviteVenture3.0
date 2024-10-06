"use client";

import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import dynamic from 'next/dynamic';

const Experience = dynamic(() => import('@/components/Landingpage/ebook/Experience').then((mod) => mod.Experience), { ssr: false });

const App: React.FC = () => {
  const canvasMemo = useMemo(() => (
    <Canvas
      shadows
      camera={{ position: [-0.5, 1, 4], fov: 45 }}
      style={{ height: "100vh", width: "100vw" }}
      onCreated={({ gl }) => {
        gl.setClearColor('white');
      }}
    >
      <group position-y={0}>
        <Suspense fallback={<Loader />}>
          <Experience />
        </Suspense>
      </group>
    </Canvas>
  ), []);

  return (
    <div className="flex justify-center items-center mx-auto w-full min-h-screen md:w-[85vw] md:h-[65vh] lg:w-[80vw] lg:h-[60vh]">
      <Suspense fallback={<div>Loading UI...</div>}>
       
      </Suspense>
      {canvasMemo}
    </div>
  );
};

export default App;
