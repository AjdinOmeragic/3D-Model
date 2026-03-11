'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import DraggableModel from './DraggableModel';

const MODEL_PATHS = {
  model_1: '/models/car1.glb',
  model_2: '/models/car2.glb',
};

const MODEL_COLORS = {
  model_1: '#6c63ff',
  model_2: '#e05a00',
};

const MODEL_SCALES = {
  model_1: 1.0,
  model_2: 1.4,
};

const MODEL_COLLISION_RADII = {
  model_1: 3.5,
  model_2: 3.5,
};

function CameraController({ is2D }: { is2D: boolean }) {
  const { camera, controls } = useThree();
  const targetRef = useRef({
    position: is2D
      ? new THREE.Vector3(0, 14, 0)
      : new THREE.Vector3(5, 6, 10),
    fov: is2D ? 50 : 60,
  });

  useEffect(() => {
    const target3D = new THREE.Vector3(5, 6, 10);
    const target2D = new THREE.Vector3(0, 14, 0.001);
    const targetPos = is2D ? target2D : target3D;

    const startPos = camera.position.clone();
    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      camera.position.lerpVectors(startPos, targetPos, ease);
      camera.lookAt(0, 0, 0);

      if (t < 1) requestAnimationFrame(animate);
    };

    animate();
  }, [is2D, camera]);

  return (
    <OrbitControls
      enabled={!is2D}
      enablePan={true}
      enableZoom={true}
      enableRotate={!is2D}
      minPolarAngle={is2D ? Math.PI / 2 : 0}
      maxPolarAngle={is2D ? Math.PI / 2 : Math.PI / 2}
      makeDefault
    />
  );
}

function SceneContent() {
  const { models, is2DView } = useAppStore();

  return (
    <>
      <CameraController is2D={is2DView} />

      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.6} color="#6c63ff" />
      <pointLight position={[5, 3, 5]} intensity={0.5} color="#e05a00" />

      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#ddddee"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#bbbbcc"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[0, -0.01, 0]}
      />

      <Suspense fallback={null}>
        {models.map((model) => (
          <DraggableModel
            key={model.id}
            model={model}
            otherModels={models}
            modelPath={MODEL_PATHS[model.id as keyof typeof MODEL_PATHS]}
            color={MODEL_COLORS[model.id as keyof typeof MODEL_COLORS]}
            scale={MODEL_SCALES[model.id as keyof typeof MODEL_SCALES]}
            collisionRadius={MODEL_COLLISION_RADII[model.id as keyof typeof MODEL_COLLISION_RADII]}
          />
        ))}
      </Suspense>
    </>
  );
}

export default function Scene3D() {
  const { is2DView } = useAppStore();

  return (
    <Canvas
      shadows
      camera={{
        position: [5, 6, 10],
        fov: 60,
        near: 0.1,
        far: 200,
      }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ background: '#2e2e5e' }}
    >
      <SceneContent />
    </Canvas>
  );
}