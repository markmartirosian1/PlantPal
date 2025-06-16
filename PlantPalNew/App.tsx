import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import type { SavedPlant } from '../storage/plantStorage';

import PlantIdentificationScreen from './src/screens/PlantIdentificationScreen';
import PlantResultScreen from './src/screens/PlantResultScreen';
import MyPlantsScreen from './src/screens/MyPlantsScreen';

export type RootStackParamList = {
  PlantIdentification: undefined;
  PlantResult: { plantData: any };
  MyPlants: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const plantId = response.notification.request.content.data.plantId;
      // Navigate to MyPlants and highlight or scroll to the plant, or show details
      // You can implement navigation logic here as needed
    });
    return () => subscription.remove();
  }, []);

  async function scheduleWateringNotification(plant: SavedPlant) {
    const trigger = {
      hour: 12,
      minute: 0,
      repeats: true
    };
    // Implement the logic to schedule a notification using the trigger
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="PlantIdentification"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#4CAF50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="PlantIdentification"
              component={PlantIdentificationScreen}
              options={{ title: 'Identify Plant' }}
            />
            <Stack.Screen
              name="PlantResult"
              component={PlantResultScreen}
              options={{ title: 'Plant Details' }}
            />
            <Stack.Screen
              name="MyPlants"
              component={MyPlantsScreen}
              options={{ title: 'My Plants' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 