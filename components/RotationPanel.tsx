'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/lib/store';

const MODEL_COLORS = {
  model_1: '#6c63ff',
  model_2: '#ff6584',
};

function AngleDial({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  color: string;
}) {
  const degrees = Math.round((value * 180) / Math.PI);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span
          style={{ color: '#8888aa', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}
        >
          {label}
        </span>
        <span
          style={{ color, fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}
        >
          {degrees}°
        </span>
      </div>
      <div className="relative flex items-center gap-2">
        <input
          type="range"
          min={-180}
          max={180}
          value={degrees}
          onChange={(e) => onChange((Number(e.target.value) * Math.PI) / 180)}
          style={{
            flex: 1,
            accentColor: color,
            height: '4px',
            cursor: 'pointer',
          }}
        />
        <button
          onClick={() => onChange(0)}
          title="Reset"
          style={{
            width: '20px',
            height: '20px',
            background: 'transparent',
            border: `1px solid #1e1e2e`,
            borderRadius: '3px',
            color: '#4a4a6a',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = color;
            (e.currentTarget as HTMLButtonElement).style.color = color;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e1e2e';
            (e.currentTarget as HTMLButtonElement).style.color = '#4a4a6a';
          }}
        >
          ↺
        </button>
      </div>
    </div>
  );
}

export default function RotationPanel() {
  const { models, selectedModelId, updateModelRotation, saveModel } = useAppStore();

  const selectedModel = models.find((m) => m.id === selectedModelId);
  const color = selectedModelId
    ? MODEL_COLORS[selectedModelId as keyof typeof MODEL_COLORS] || '#6c63ff'
    : '#6c63ff';

  const handleRotationChange = useCallback(
    async (axis: 0 | 1 | 2, value: number) => {
      if (!selectedModel) return;
      const newRotation = [...selectedModel.rotation] as [number, number, number];
      newRotation[axis] = value;
      updateModelRotation(selectedModel.id, newRotation);
      await saveModel(selectedModel.id);
    },
    [selectedModel, updateModelRotation, saveModel]
  );

  if (!selectedModel) {
    return (
      <div
        style={{
          background: 'rgba(18,18,26,0.9)',
          border: '1px solid #1e1e2e',
          borderRadius: '8px',
          padding: '16px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p
          style={{
            color: '#4a4a6a',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            textAlign: 'center',
          }}
        >
          Click any model to edit rotation
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(18,18,26,0.9)',
        border: `1px solid ${color}33`,
        borderRadius: '8px',
        padding: '16px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          <span
            style={{
              color: '#e0e0f0',
              fontFamily: 'Syne, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {selectedModel.name}
          </span>
        </div>
        <span
          style={{
            color: '#4a4a6a',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
          }}
        >
          ROTATION
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <AngleDial
          label="X axis"
          value={selectedModel.rotation[0]}
          onChange={(v) => handleRotationChange(0, v)}
          color={color}
        />
        <AngleDial
          label="Y axis"
          value={selectedModel.rotation[1]}
          onChange={(v) => handleRotationChange(1, v)}
          color={color}
        />
        <AngleDial
          label="Z axis"
          value={selectedModel.rotation[2]}
          onChange={(v) => handleRotationChange(2, v)}
          color={color}
        />
      </div>
      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #1e1e2e',
        }}
      >
        <span
          style={{
            color: '#4a4a6a',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
          }}
        >
          POSITION
        </span>
        <div
          style={{
            marginTop: '6px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: '#8888aa',
          }}
        >
          X:{selectedModel.position[0].toFixed(2)} Y:{selectedModel.position[1].toFixed(2)} Z:
          {selectedModel.position[2].toFixed(2)}
        </div>
      </div>
    </div>
  );
}
