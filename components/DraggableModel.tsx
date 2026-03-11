'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import { ModelTransform } from '@/lib/firestoreService';

interface DraggableModelProps {
  model: ModelTransform;
  otherModels: ModelTransform[];
  modelPath: string;
  color: string;
  scale: number;
  collisionRadius: number;
}

export default function DraggableModel({
  model,
  otherModels,
  modelPath,
  color,
  scale,
  collisionRadius,
}: DraggableModelProps) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = scene.clone();

  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl, raycaster } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());

  const { updateModelPosition, saveModel, setSelectedModel, selectedModelId, is2DView } =
    useAppStore();

  const isSelected = selectedModelId === model.id;

  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m) => {
          const mat = m.clone() as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color(isSelected ? color : '#000000');
          mat.emissiveIntensity = isSelected ? 0.15 : 0;
          return mat;
        });
      } else {
        const mat = (child.material as THREE.MeshStandardMaterial).clone();
        mat.emissive = new THREE.Color(isSelected ? color : '#000000');
        mat.emissiveIntensity = isSelected ? 0.15 : 0;
        child.material = mat;
      }
    }
  });

  const checkCollision = useCallback(
    (newPos: THREE.Vector3): boolean => {
      for (const other of otherModels) {
        if (other.id === model.id) continue;
        const otherPos = new THREE.Vector3(...other.position);
        const dist = newPos.distanceTo(otherPos);
        if (dist < collisionRadius + 1.0) return true;
      }
      return false;
    },
    [model.id, otherModels, collisionRadius]
  );

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setSelectedModel(model.id);
      setIsDragging(true);
      gl.domElement.style.cursor = 'grabbing';
      dragPlane.current.constant = -model.position[1];
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane.current, intersection);
      dragOffset.current.subVectors(
        new THREE.Vector3(...model.position),
        intersection
      );
    },
    [model.id, model.position, gl, raycaster, setSelectedModel]
  );

  const handlePointerUp = useCallback(async () => {
    if (isDragging) {
      setIsDragging(false);
      gl.domElement.style.cursor = isHovered ? 'grab' : 'default';
      await saveModel(model.id);
    }
  }, [isDragging, isHovered, gl, model.id, saveModel]);

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging) return;
      e.stopPropagation();

      const intersection = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane.current, intersection)) {
        const newPos = intersection.add(dragOffset.current);
        newPos.x = Math.max(-8, Math.min(8, newPos.x));
        newPos.z = Math.max(-8, Math.min(8, newPos.z));
        newPos.y = model.position[1];

        if (!checkCollision(newPos)) {
          updateModelPosition(model.id, [newPos.x, newPos.y, newPos.z]);
        }
      }
    },
    [isDragging, raycaster, dragOffset, model.id, model.position, updateModelPosition, checkCollision]
  );

  return (
    <group
      ref={groupRef}
      position={model.position}
      rotation={model.rotation}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={() => {
        setIsHovered(true);
        gl.domElement.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        if (!isDragging) gl.domElement.style.cursor = 'default';
      }}
    >
      <primitive object={clonedScene} scale={scale} />
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <ringGeometry args={[0.9, 1.1, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      )}

      {isHovered && !isSelected && (
        <mesh>
          <sphereGeometry args={[0.95, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.05} wireframe />
        </mesh>
      )}

      {(isSelected || isHovered) && (
        <Html position={[0, 1.8, 0]} center>
          <div
            style={{
              background: 'rgba(10,10,20,0.85)',
              border: `1px solid ${color}`,
              borderRadius: '4px',
              padding: '3px 8px',
              color: color,
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {model.name}
          </div>
        </Html>
      )}
    </group>
  );
}