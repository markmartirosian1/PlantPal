import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlantSuggestion } from '../services/plantIdApi';

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