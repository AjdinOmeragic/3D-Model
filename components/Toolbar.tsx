'use client';

import { useAppStore } from '@/lib/store';

export default function Toolbar() {
  const { is2DView, toggleView, saveStatus } = useAppStore();

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(18,18,26,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #1e1e2e',
        borderRadius: '40px',
        padding: '8px 16px',
      }}
    >

      <div style={{ width: '1px', height: '20px', background: '#1e1e2e' }} />

      <button
        onClick={toggleView}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: is2DView ? 'rgba(108,99,255,0.15)' : 'transparent',
          border: `1px solid ${is2DView ? '#6c63ff' : '#2a2a3a'}`,
          borderRadius: '20px',
          padding: '4px 12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: is2DView ? '#6c63ff' : '#8888aa',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        }}
        onMouseEnter={(e) => {
          if (!is2DView) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#6c63ff44';
            (e.currentTarget as HTMLButtonElement).style.color = '#b0b0cc';
          }
        }}
        onMouseLeave={(e) => {
          if (!is2DView) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a3a';
            (e.currentTarget as HTMLButtonElement).style.color = '#8888aa';
          }
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          {is2DView ? (
            <>
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="rgba(108,99,255,0.2)" />
              <line x1="7" y1="1" x2="7" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="13" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M7 2L12 5V9L7 12L2 9V5L7 2Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <line x1="7" y1="2" x2="7" y2="7" stroke="currentColor" strokeWidth="1" strokeDasharray="1,1" />
              <line x1="7" y1="7" x2="12" y2="5" stroke="currentColor" strokeWidth="1" strokeDasharray="1,1" />
              <line x1="7" y1="7" x2="2" y2="5" stroke="currentColor" strokeWidth="1" strokeDasharray="1,1" />
            </>
          )}
        </svg>
        {is2DView ? 'TOP-DOWN' : '3D VIEW'}
      </button>

      <div style={{ width: '1px', height: '20px', background: '#1e1e2e' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color:
            saveStatus === 'saved'
              ? '#50fa7b'
              : saveStatus === 'saving'
              ? '#f1fa8c'
              : saveStatus === 'error'
              ? '#ff5555'
              : '#4a4a6a',
          transition: 'color 0.3s ease',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background:
              saveStatus === 'saved'
                ? '#50fa7b'
                : saveStatus === 'saving'
                ? '#f1fa8c'
                : saveStatus === 'error'
                ? '#ff5555'
                : '#2a2a3a',
            transition: 'background 0.3s ease',
            animation: saveStatus === 'saving' ? 'pulse 0.8s infinite' : 'none',
          }}
        />
        {saveStatus === 'saving'
          ? 'SAVING...'
          : saveStatus === 'saved'
          ? 'SAVED'
          : saveStatus === 'error'
          ? 'ERROR'
          : 'FIREBASE'}
      </div>
    </div>
  );
}
