import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from "@react-three/drei";
import { dampE } from 'maath/easing';

export default function Model(props) {
  const { nodes, materials } = useGLTF("/sqft-01.glb");
  const groupRef = useRef();
  const rotationRef = useRef([0, 0, 0]);

  // Rotate the model based on mouse movement
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = (clientX / innerWidth) * 2 - 1;
    const y = -(clientY / innerHeight) * 2 + 1;

    rotationRef.current = [y * -0.5, x * 2.5, 0];
  };

  // Auto-rotate the model
  useFrame((state, delta) => {
    if (window.innerWidth <= 900) {
      const elapsedTime = state.clock.getElapsedTime();
      groupRef.current.rotation.y = elapsedTime * 0.25; // Adjust the rotation speed as needed
      groupRef.current.rotation.x = 0;
    } else {
      const targetRotation = rotationRef.current;
      dampE(groupRef.current.rotation, targetRotation, 0.25, delta);
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
    <group {...props} dispose={null} ref={groupRef} scale={.25}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Pages.geometry}
        material={materials.Pages}
        position={[0, 0, 0.07]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Spine_Cover.geometry}
        material={materials.Spine}
        position={[-1.83, 0, -0.02]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Back_Cover.geometry}
        material={materials.Back}
        position={[0, 0, -0.12]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Front_Cover.geometry}
        material={materials.Front}
        position={[0, 0, 0.08]}
      />
    </group>
  );
};

useGLTF.preload("/sqft-01.glb");