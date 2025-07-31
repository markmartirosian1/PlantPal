import { SavedPlant } from '../storage/plantStorage';

export interface WateringStatus {
  needsWatering: boolean;
  daysUntilWatering: number;
  lastWatered: string;
}

export const calculateWateringStatus = (plant: SavedPlant): WateringStatus => {
  if (!plant.wateringSchedule) {
    return {
      needsWatering: false,
      daysUntilWatering: 0,
      lastWatered: 'Not set',
    };
  }

  const lastWatered = new Date(plant.wateringSchedule.lastWatered);
  const today = new Date();
  const daysSinceLastWatered = Math.floor(
    (today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    needsWatering: daysSinceLastWatered >= plant.wateringSchedule.frequency,
    daysUntilWatering: Math.max(0, plant.wateringSchedule.frequency - daysSinceLastWatered),
    lastWatered: lastWatered.toLocaleDateString(),
  };
};

export const updateWateringSchedule = (
  plant: SavedPlant,
  frequency: number
): SavedPlant => {
  return {
    ...plant,
    wateringSchedule: {
      frequency,
      lastWatered: new Date().toISOString(),
      timeOfDay: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  };
};    

export const markAsWatered = (plant: SavedPlant): SavedPlant => {
  if (!plant.wateringSchedule) {
    return plant;
  }

  return {
    ...plant,
    wateringSchedule: {
      ...plant.wateringSchedule,
      lastWatered: new Date().toISOString(),
    },
  };
}; 