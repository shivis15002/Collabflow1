
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Pencil, Trash2, Calendar, User, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";

// 3D card component that renders inside the Canvas
function Card3D({ 
  isHovered, 
  isFlipped, 
  title, 
  description, 
  priority = 'medium',
  dueDate,
  assignee
}: { 
  isHovered: boolean; 
  isFlipped: boolean;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  
  // Add animation effects
  useFrame(() => {
    if (!mesh.current) return;
    
    // Rotation animation for hovering
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      isHovered ? -0.2 : 0,
      0.1
    );
    mesh.current.rotation.y = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      isHovered ? 0.2 : 0,
      0.1
    );
    
    // Flip animation for showing details
    mesh.current.rotation.y = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      isFlipped ? Math.PI : 0,
      0.15
    );
  });
  
  // Determine priority color
  const priorityColor = {
    low: "#22c55e",     // Green
    medium: "#f59e0b",  // Amber
    high: "#ef4444"     // Red
  }[priority];
  
  return (
    <mesh ref={mesh} castShadow>
      {/* Front side */}
      <boxGeometry args={[3.8, 2, 0.1]} />
      <meshStandardMaterial color={isFlipped ? "#f5f5f5" : "#ffffff"} />
      
      {/* Card contents - front */}
      {!isFlipped && (
        <>
          <Text 
            position={[-1.5, 0.7, 0.06]} 
            fontSize={0.25}
            color="#000000"
            anchorX="left"
            maxWidth={3}
            font="/fonts/Inter-Medium.woff"
            textAlign="left"
          >
            {title}
          </Text>

          <mesh position={[1.7, -0.8, 0.06]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={priorityColor} />
          </mesh>
          
          {dueDate && (
            <Text 
              position={[-1.5, -0.7, 0.06]} 
              fontSize={0.15}
              color="#666666"
              anchorX="left"
              font="/fonts/Inter-Medium.woff"
            >
              {dueDate}
            </Text>
          )}
          
          {assignee && (
            <Text 
              position={[0, -0.7, 0.06]} 
              fontSize={0.15}
              color="#666666"
              anchorX="left"
              font="/fonts/Inter-Medium.woff"
            >
              {assignee}
            </Text>
          )}
        </>
      )}
      
      {/* Card contents - back */}
      {isFlipped && (
        <>
          <Text 
            position={[-1.5, 0.7, -0.06]} 
            fontSize={0.25}
            color="#000000"
            anchorX="left"
            maxWidth={3}
            font="/fonts/Inter-Medium.woff"
            textAlign="left"
            rotation={[0, Math.PI, 0]}
          >
            {title}
          </Text>
          
          <Text 
            position={[-1.5, 0.2, -0.06]} 
            fontSize={0.15}
            color="#666666"
            anchorX="left"
            maxWidth={3}
            font="/fonts/Inter-Medium.woff"
            textAlign="left"
            rotation={[0, Math.PI, 0]}
          >
            {description}
          </Text>
          
          {dueDate && (
            <Text 
              position={[-1.5, -0.5, -0.06]} 
              fontSize={0.15}
              color="#666666"
              anchorX="left"
              font="/fonts/Inter-Medium.woff"
              rotation={[0, Math.PI, 0]}
            >
              {`Due: ${dueDate}`}
            </Text>
          )}
          
          {assignee && (
            <Text 
              position={[-1.5, -0.7, -0.06]} 
              fontSize={0.15}
              color="#666666"
              anchorX="left"
              font="/fonts/Inter-Medium.woff"
              rotation={[0, Math.PI, 0]}
            >
              {`Assigned to: ${assignee}`}
            </Text>
          )}
          
          <Text 
            position={[1.3, -0.7, -0.06]} 
            fontSize={0.15}
            color={priorityColor}
            anchorX="left"
            font="/fonts/Inter-Medium.woff"
            rotation={[0, Math.PI, 0]}
          >
            {`Priority: ${priority}`}
          </Text>
        </>
      )}
    </mesh>
  );
}

interface Task3DCardProps {
  id: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const Task3DCard: React.FC<Task3DCardProps> = ({
  id,
  title,
  description,
  priority = 'medium',
  dueDate,
  assignee,
  onEdit,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="w-full h-40 mb-4 relative" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Card3D 
          isHovered={isHovered} 
          isFlipped={isFlipped}
          title={title}
          description={description}
          priority={priority}
          dueDate={dueDate}
          assignee={assignee}
        />
      </Canvas>
      
      {/* Overlay controls that stay visible */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-white/70 backdrop-blur-sm hover:bg-white/90"
        >
          <Pencil size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-white/70 backdrop-blur-sm hover:bg-white/90"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Task3DCard;
