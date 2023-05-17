import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Model({ autoRotate }) {
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
    if (autoRotate) {
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
    <group ref={groupRef}>
        <mesh >
            <boxBufferGeometry attach='geometry' args={[2, 3, .25]}/>
            <meshStandardMaterial attach='material' color='turquoise' />
        </mesh>
    </group>
  );
};