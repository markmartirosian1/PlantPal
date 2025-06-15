import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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