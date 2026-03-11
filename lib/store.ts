import { create } from 'zustand';
import { ModelTransform, loadModelsFromFirestore, saveModelToFirestore } from './firestoreService';

interface AppState {
  models: ModelTransform[];
  selectedModelId: string | null;
  is2DView: boolean;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';

  loadModels: () => Promise<void>;
  updateModelPosition: (id: string, position: [number, number, number]) => void;
  updateModelRotation: (id: string, rotation: [number, number, number]) => void;
  saveModel: (id: string) => Promise<void>;
  setSelectedModel: (id: string | null) => void;
  toggleView: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  models: [],
  selectedModelId: null,
  is2DView: false,
  isLoading: false,
  isSaving: false,
  saveStatus: 'idle',

  loadModels: async () => {
    set({ isLoading: true });
    const models = await loadModelsFromFirestore();
    set({ models, isLoading: false });
  },

  updateModelPosition: (id, position) => {
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, position } : m
      ),
    }));
  },

  updateModelRotation: (id, rotation) => {
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, rotation } : m
      ),
    }));
  },

  saveModel: async (id) => {
    const model = get().models.find((m) => m.id === id);
    if (!model) return;

    set({ saveStatus: 'saving' });
    await saveModelToFirestore(model);
    set({ saveStatus: 'saved' });

    setTimeout(() => set({ saveStatus: 'idle' }), 2000);
  },

  setSelectedModel: (id) => set({ selectedModelId: id }),

  toggleView: () => set((state) => ({ is2DView: !state.is2DView })),
}));
