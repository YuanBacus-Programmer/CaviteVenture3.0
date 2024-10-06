"use client";
import React, { useRef, useEffect, FC, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { pointsInner, pointsOuter } from '@/components/Landingpage/ParticleRingF/utils';

// ParticleRing component
const ParticleRing: FC = () => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([10, -7.5, -5]);
  const [fontSize, setFontSize] = useState('2.5rem');
  const [padding, setPadding] = useState('20px');
  const [numPoints, setNumPoints] = useState({ inner: 2500, outer: 625 });

  useEffect(() => {
    const updateDimensions = () => {
      const isSmallScreen = window.innerWidth < 640;
      const isMediumScreen = window.innerWidth >= 640 && window.innerWidth < 1024;

      setCameraPosition(
        isSmallScreen ? [7, -5, -4] :
        isMediumScreen ? [9, -7, -5] :
        [10, -7.5, -5]
      );

      setFontSize(isSmallScreen ? '1.5rem' : isMediumScreen ? '2rem' : '2.5rem');
      setPadding(isSmallScreen ? '10px' : '20px');

      // Adjust number of points based on screen size for better performance
      setNumPoints({
        inner: isSmallScreen ? 1000 : isMediumScreen ? 2000 : 2500,
        outer: isSmallScreen ? 250 : isMediumScreen ? 500 : 625
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative">
      <Canvas
        camera={{
          position: cameraPosition,
        }}
        style={{ height: '100vh', backgroundColor: '#ffffff' }} // Background color set to white
      >
        <CustomOrbitControls />
        <directionalLight />
        <pointLight position={[-30, 0, -30]} intensity={1} />
        <PointCircle numPoints={numPoints} />
        <Html position={[0, 0, 0]} center>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            color: '#000000',
            fontSize: fontSize,
            fontWeight: '500',
            textAlign: 'center',
            padding: padding,
            fontFamily: "'Cormorant Garamond', serif", // Apply the new font here
          }}>
            Turn back in time and discover<br /> more about the history of Cavite
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

// Custom Orbit Controls component using three.js directly
const CustomOrbitControls: FC = () => {
  const { camera, gl } = useThree(); // Access the camera and WebGL renderer
  const controlsRef = useRef<ThreeOrbitControls | null>(null); // Create a ref for the OrbitControls instance

  useEffect(() => {
    // Create an OrbitControls instance manually
    const controls = new ThreeOrbitControls(camera, gl.domElement);
    controls.minDistance = 10; // Set min and max zoom distances
    controls.maxDistance = 20;

    // Set up an event listener for changes in controls
    controls.addEventListener('change', () => {
      const distance = camera.position.distanceTo(controls.target); // Get the distance to the target
      if (distance === controls.minDistance) {
        window.scrollBy(0, -10); // Scroll up when zoomed in fully
      } else if (distance === controls.maxDistance) {
        window.scrollBy(0, 10); // Scroll down when zoomed out fully
      }
    });

    controlsRef.current = controls; // Save controls to the ref

    return () => {
      controls.dispose(); // Clean up on unmount
    };
  }, [camera, gl]);

  return null; // No need to render anything
};

// PointCircle component that uses inner and outer points
interface PointCircleProps {
  numPoints: { inner: number, outer: number };
}

const PointCircle: FC<PointCircleProps> = ({ numPoints }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  const memoizedInnerPoints = useMemo(() => pointsInner.slice(0, numPoints.inner), [numPoints.inner]);
  const memoizedOuterPoints = useMemo(() => pointsOuter.slice(0, numPoints.outer), [numPoints.outer]);

  return (
    <group ref={ref}>
      {memoizedInnerPoints.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
      {memoizedOuterPoints.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
    </group>
  );
};

// Individual Point component
interface PointProps {
  position: [number, number, number];
  color: string;
}

const Point: FC<PointProps> = ({ position, color }) => {
  return (
    <Sphere position={position} args={[0.1, 10, 10]}>
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
        color={color}
      />
    </Sphere>
  );
};

export default ParticleRing;
