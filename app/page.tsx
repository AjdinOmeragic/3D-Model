'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import Toolbar from '@/components/Toolbar';
import ModelList from '@/components/ModelList';
import RotationPanel from '@/components/RotationPanel';
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid #1e1e2e',
          borderTop: '2px solid #6c63ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p
        style={{
          color: '#4a4a6a',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          letterSpacing: '0.1em',
        }}
      >
        LOADING SCENE...
      </p>
    </div>
  ),
});

export default function Home() {
  const { loadModels, isLoading } = useAppStore();

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        background: '#2e2e5e',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,101,132,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Scene3D />
      </div>

      <Toolbar />

      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '20px',
          width: '200px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <ModelList />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          width: '220px',
          zIndex: 100,
        }}
      >
        <RotationPanel />
      </div>

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(244,244,248,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '2px solid #1e1e2e',
              borderTop: '2px solid #6c63ff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p
            style={{
              color: '#888899',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            }}
          >
            SYNCING WITH FIREBASE...
          </p>
        </div>
      )}
    </main>
  );
}