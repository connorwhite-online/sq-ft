import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from "@react-three/drei";
import { dampE } from 'maath/easing';

export default function Model(props) {
  const { nodes, materials } = useGLTF("/sqft-01.glb");
  const groupRef = useRef();
  const rotationRef = useRef([0, 0, 0]);
  const orbitControlsRef = useRef();
  const isControllingRef = useRef(false);
  const isResettingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  
  // Animation state
  const targetRotationRef = useRef(0);
  const rotationSteps = [Math.PI * 0.1, Math.PI * 0.25, Math.PI * 1.1, Math.PI * 1.25];
  const currentStepRef = useRef(0);
  const fastDamping = 0.5;
  const slowDamping = 3;

  // Handle mouse movement (desktop)
  const handleMouseMove = (event) => {
    if (!isMobile) {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth) * 2 - 1;
      const y = -(clientY / innerHeight) * 2 + 1;

      rotationRef.current = [y * -0.5, x * 2.5, 0];
    }
  };

  // Animation frame update
  useFrame((state, delta) => {
    if (isMobile) {
      if (!orbitControlsRef.current?.isDragging && !isResettingRef.current && !isControllingRef.current) {
        const currentY = groupRef.current.rotation.y;
        const distance = Math.abs(targetRotationRef.current - currentY);

        // Check if we've reached the target
        if (distance < 0.01) {
          currentStepRef.current = (currentStepRef.current + 1) % rotationSteps.length;
          
          if (currentStepRef.current === 0) {
            rotationSteps.forEach((step, index) => {
              rotationSteps[index] = step + Math.PI * 2;
            });
          }
          
          targetRotationRef.current = rotationSteps[currentStepRef.current];
        }

        // Apply rotation with alternating speeds
        dampE(
          groupRef.current.rotation,
          [0, targetRotationRef.current, 0],
          currentStepRef.current % 2 === 0 ? fastDamping : slowDamping,
          delta
        );
      }
    } else {
      dampE(groupRef.current.rotation, rotationRef.current, 0.25, delta);
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  // Add these handlers to the OrbitControls component
  const handleControlsStart = () => {
    isControllingRef.current = true;
  };

  const handleControlsChange = () => {
    if (orbitControlsRef.current?.isDragging) {
      isControllingRef.current = true;
    }
  };

  // Modify the handleControlsEnd function
  const handleControlsEnd = () => {
    if (orbitControlsRef.current) {
      isResettingRef.current = true;
      isControllingRef.current = false;
      
      // Reset to initial camera position
      orbitControlsRef.current.setAzimuthalAngle(0);
      orbitControlsRef.current.setPolarAngle(Math.PI / 2);
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.update();

      setTimeout(() => {
        isResettingRef.current = false;
      }, 1000);
    }
  };

  return (
    <>
      {isMobile && (
        <OrbitControls 
          ref={orbitControlsRef}
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.025}
          rotateSpeed={0.5}
          onStart={handleControlsStart}
          onChange={handleControlsChange}
          onEnd={handleControlsEnd}
        />
      )}
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
    </>
  );
}

useGLTF.preload("/sqft-01.glb");