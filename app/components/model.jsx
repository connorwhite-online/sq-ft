import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/sqft-01.glb");
  const groupRef = useRef();

  // Rotate the model based on mouse movement
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = (clientX / innerWidth) * 2 - 1;
    const y = -(clientY / innerHeight) * 2 + 1;

    groupRef.current.rotation.x = y * -.5;
    groupRef.current.rotation.y = x * 2.5;
  };

  // Auto-rotate the model
  useFrame(({ clock }) => {
    if (window.innerWidth <= 768) {
      const elapsedTime = clock.getElapsedTime();
      groupRef.current.rotation.y = elapsedTime * 0.1; // Adjust the rotation speed as needed
    }
  });

  useEffect(() => {
    // Add event listener to track mouse movement
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <group {...props} dispose={null} scale={.08} ref={groupRef}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Pages.geometry}
        material={materials.Pages}
        position={[0.36, 0, 0.87]}
        scale={0.1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Spine_Cover.geometry}
        material={materials.Spine}
        position={[-22.52, 0, -0.29]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[0.1, 29.7, 1.27]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Back_Cover.geometry}
        material={materials.Back}
        position={[0.36, 0, -1.55]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[22.86, 29.7, 0.1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Front_Cover.geometry}
        material={materials.Front}
        position={[0.36, 0, 0.97]}
        scale={[22.86, 29.7, 0.1]}
      />
    </group>
  );
};

useGLTF.preload("/sqft-01.glb");