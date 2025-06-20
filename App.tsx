import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import type { SavedPlant } from './src/storage/plantStorage';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';

import PlantIdentificationScreen from './src/screens/PlantIdentificationScreen';
import PlantResultScreen from './src/screens/PlantResultScreen';
import MyPlantsScreen from './src/screens/MyPlantsScreen';

export type RootStackParamList = {
  PlantIdentification: undefined;
  PlantResult: { plantData: any };
  MyPlants: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> }) {
  return (
    <View style={styles.homeContainer}>
      <Text variant="headlineMedium" style={styles.homeTitle}>Welcome to PlantPal!</Text>
      <Button
        mode="contained"
        style={styles.homeButton}
        onPress={() => navigation.navigate('MyPlants')}
      >
        My Plants
      </Button>
      <Button
        mode="contained"
        style={styles.homeButton}
        onPress={() => navigation.navigate('PlantIdentification')}
      >
        Add a Plant
      </Button>
    </View>
  );
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  useEffect(() => {
    // Request notification permissions
    async function requestPermissions() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get notification permissions');
        return;
      }
    }

    requestPermissions();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const plantId = response.notification.request.content.data.plantId;
      // Navigate to MyPlants and highlight or scroll to the plant, or show details
      // You can implement navigation logic here as needed
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
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
              name="Home"
              component={HomeScreen}
              options={{ title: 'Home' }}
            />
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

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  homeTitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  homeButton: {
    marginVertical: 12,
    width: 200,
  },
}); 