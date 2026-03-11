'use client';

import { useAppStore } from '@/lib/store';

const MODEL_COLORS = {
  model_1: '#6c63ff',
  model_2: '#e05a00',
};

export default function ModelList() {
  const { models, selectedModelId, setSelectedModel, saveModel, updateModelRotation } =
    useAppStore();

  return (
    <div
      style={{
        background: 'rgba(244,244,248,0.92)',
        border: '1px solid #e0e0ee',
        borderRadius: '8px',
        padding: '12px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          color: '#9999bb',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          marginBottom: '10px',
          letterSpacing: '0.1em',
        }}
      >
        MODELS
      </div>

      <div className="flex flex-col gap-2">
        {models.map((model) => {
          const color = MODEL_COLORS[model.id as keyof typeof MODEL_COLORS];
          const isSelected = selectedModelId === model.id;

          return (
            <button
              key={model.id}
              onClick={() => setSelectedModel(isSelected ? null : model.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: isSelected ? `${color}12` : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isSelected ? color + '66' : '#e0e0ee'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = color + '33';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#e0e0ee';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.02)';
                }
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                  flexShrink: 0,
                  opacity: isSelected ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                }}
              />
              <div>
                <div
                  style={{
                    color: isSelected ? color : '#1a1a2e',
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: 'color 0.2s',
                  }}
                >
                  {model.name}
                </div>
              </div>
              {isSelected && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}