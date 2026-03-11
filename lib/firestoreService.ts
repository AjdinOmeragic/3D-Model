import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export interface ModelTransform {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  name: string;
}

const COLLECTION = 'models';

export async function loadModelsFromFirestore(): Promise<ModelTransform[]> {
  try {
    const defaults: ModelTransform[] = [
      { id: 'model_1', name: 'Car 1', position: [-3, 0, 0], rotation: [0, 0, 0] },
      { id: 'model_2', name: 'Car 2', position: [3, 0, 0], rotation: [0, Math.PI / 6, 0] },
    ];

    const results: ModelTransform[] = [];

    for (const def of defaults) {
      const ref = doc(db, COLLECTION, def.id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        results.push(snap.data() as ModelTransform);
      } else {
        await setDoc(ref, def);
        results.push(def);
      }
    }

    return results;
  } catch (error) {
    console.error('Firestore load error:', error);
    return [
      { id: 'model_1', name: 'Car 1', position: [-3, 0, 0], rotation: [0, 0, 0] },
      { id: 'model_2', name: 'Car 2', position: [3, 0, 0], rotation: [0, Math.PI / 6, 0] },
    ];
  }
}

export async function saveModelToFirestore(model: ModelTransform): Promise<void> {
  try {
    const ref = doc(db, COLLECTION, model.id);
    await setDoc(ref, model);
  } catch (error) {
    console.error('Firestore save error:', error);
  }
}