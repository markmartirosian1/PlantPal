import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { PLANT_ID_API_KEY } from '@env';

const PLANT_ID_API_URL = 'https://api.plant.id/v2/identify';

export interface PlantSuggestion {
  name: string;
  probability: number;
  details: {
    common_names: string[];
    scientific_name: string;
    family: string;
  };
}

export interface PlantIdentificationResponse {
  status: string;
  data: {
    suggestions: PlantSuggestion[];
    images: {
      organs: string[];
    };
  };
}

export const identifyPlant = async (imageUri: string): Promise<any> => {
  try {
    // Convert image to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

    const response = await axios.post(
      PLANT_ID_API_URL,
      {
        images: [base64],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': PLANT_ID_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error identifying plant:', error);
    throw error;
  }
}; 