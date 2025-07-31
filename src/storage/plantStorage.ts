import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlantSuggestion } from '../services/plantIdApi';

export interface WateringEvent {
  timestamp: string; // ISO string of when the plant was actually watered
  timeOfDay: string; // The time of day when it was watered (e.g., "14:30")
}

export interface SavedPlant {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  imageUri: string;
  dateIdentified: string;
  wateringSchedule?: {
    frequency: number; // days
    lastWatered: string;
    timeOfDay: string; // e.g., "08:00"
    originalTimeOfDay?: string; // e.g., "08:00" - stored when delay is applied
    wateringHistory?: WateringEvent[]; // Array of actual watering events
  };
}

const PLANTS_STORAGE_KEY = '@PlantPal:plants';

export const savePlant = async (plant: Omit<SavedPlant, 'id'>): Promise<SavedPlant> => {
  try {
    const existingPlants = await getPlants();
    const newPlant: SavedPlant = {
      ...plant,
      id: Date.now().toString(),
    };

    await AsyncStorage.setItem(
      PLANTS_STORAGE_KEY,
      JSON.stringify([...existingPlants, newPlant])
    );

    return newPlant;
  } catch (error) {
    console.error('Error saving plant:', error);
    throw error;
  }
};

export const getPlants = async (): Promise<SavedPlant[]> => {
  try {
    const plantsJson = await AsyncStorage.getItem(PLANTS_STORAGE_KEY);
    return plantsJson ? JSON.parse(plantsJson) : [];
  } catch (error) {
    console.error('Error getting plants:', error);
    return [];
  }
};

export const updatePlant = async (plant: SavedPlant): Promise<void> => {
  try {
    const plants = await getPlants();
    const updatedPlants = plants.map((p) => (p.id === plant.id ? plant : p));
    await AsyncStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(updatedPlants));
  } catch (error) {
    console.error('Error updating plant:', error);
    throw error;
  }
};

export const deletePlant = async (plantId: string): Promise<void> => {
  try {
    const plants = await getPlants();
    const updatedPlants = plants.filter((p) => p.id !== plantId);
    await AsyncStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(updatedPlants));
  } catch (error) {
    console.error('Error deleting plant:', error);
    throw error;
  }
};

export const addWateringEvent = async (plantId: string, wateringTime: Date): Promise<void> => {
  try {
    const plants = await getPlants();
    const plantIndex = plants.findIndex(p => p.id === plantId);
    
    if (plantIndex === -1) {
      throw new Error('Plant not found');
    }

    const plant = plants[plantIndex];
    const wateringEvent: WateringEvent = {
      timestamp: wateringTime.toISOString(),
      timeOfDay: wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedPlant = {
      ...plant,
      wateringSchedule: {
        ...plant.wateringSchedule!,
        lastWatered: wateringTime.toISOString(),
        wateringHistory: [
          ...(plant.wateringSchedule?.wateringHistory || []),
          wateringEvent
        ]
      }
    };

    plants[plantIndex] = updatedPlant;
    await AsyncStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(plants));
  } catch (error) {
    console.error('Error adding watering event:', error);
    throw error;
  }
};

export const getWateringHistory = async (plantId: string): Promise<WateringEvent[]> => {
  try {
    const plants = await getPlants();
    const plant = plants.find(p => p.id === plantId);
    return plant?.wateringSchedule?.wateringHistory || [];
  } catch (error) {
    console.error('Error getting watering history:', error);
    return [];
  }
}; 