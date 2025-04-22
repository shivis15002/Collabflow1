
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CalendarButtonProps {
  day: number;
  hasNotes: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function CalendarButton({ day, hasNotes, isToday, isSelected }: CalendarButtonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Simple hover animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      0,
      0.1
    );
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      0,
      0.1
    );
  });
  
  const handlePointerOver = () => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -0.2;
      meshRef.current.rotation.y = 0.2;
    }
  };
  
  const handlePointerOut = () => {
    if (meshRef.current) {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
    }
  };
  
  // Determine colors based on state
  let bgColor = isSelected ? "#9b87f5" : "#ffffff";
  let textColor = isSelected ? "#ffffff" : "#000000";
  
  if (isToday && !isSelected) {
    bgColor = "#e5deff";
  }
  
  return (
    <mesh
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      position={[0, 0, 0]}
      castShadow
    >
      <boxGeometry args={[0.85, 0.85, 0.1]} />
      <meshStandardMaterial color={bgColor} />
      <Text
        position={[0, 0, 0.06]}
        color={textColor}
        fontSize={0.4}
        font="/fonts/Inter-Medium.woff"
        anchorX="center"
        anchorY="middle"
      >
        {day.toString()}
      </Text>
      {hasNotes && (
        <mesh position={[0, -0.25, 0.06]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#9b87f5" />
        </mesh>
      )}
    </mesh>
  );
}

export function Calendar3DButton({ 
  day, 
  hasNotes, 
  isToday, 
  isSelected, 
  onClick 
}: CalendarButtonProps) {
  return (
    <div 
      onClick={onClick}
      className="w-9 h-9 cursor-pointer"
    >
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <CalendarButton 
          day={day} 
          hasNotes={hasNotes} 
          isToday={isToday} 
          isSelected={isSelected}
          onClick={onClick} 
        />
      </Canvas>
    </div>
  );
}
