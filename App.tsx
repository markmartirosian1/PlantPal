import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import type { SavedPlant } from './src/storage/plantStorage';
import { getPlants } from './src/storage/plantStorage';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';

import PlantIdentificationScreen from './src/screens/PlantIdentificationScreen';
import PlantResultScreen from './src/screens/PlantResultScreen';
import MyPlantsScreen from './src/screens/MyPlantsScreen';
import PlantCalendarScreen from './src/screens/PlantCalendarScreen';

export type RootStackParamList = {
  PlantIdentification: undefined;
  PlantResult: { plantData: any };
  MyPlants: undefined;
  Home: undefined;
  PlantCalendar: undefined;
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
        onPress={() => navigation.navigate('PlantCalendar')}
      >
        Plant Calendar
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
      console.log('📱 Current notification permission status:', existingStatus);
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        console.log('🔐 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('📱 New permission status:', finalStatus);
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Failed to get notification permissions');
        return;
      } else {
        console.log('✅ Notification permissions granted');
      }
    }

    // Clean up orphaned notifications
    async function cleanupOrphanedNotifications() {
      try {
        const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
        const savedPlants = await getPlants();
        const savedPlantIds = new Set(savedPlants.map(plant => plant.id));
        
        let orphanedCount = 0;
        
        for (const notification of existingNotifications) {
          const plantId = notification.content.data?.plantId;
          if (plantId && !savedPlantIds.has(plantId)) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            orphanedCount++;
            console.log('🧹 Cleaned up orphaned notification for deleted plant ID:', plantId);
          }
        }
        
        if (orphanedCount > 0) {
          console.log(`🧹 Cleaned up ${orphanedCount} orphaned notification(s)`);
        } else {
          console.log('✅ No orphaned notifications found');
        }
      } catch (error) {
        console.error('Error cleaning up orphaned notifications:', error);
      }
    }

    requestPermissions();
    cleanupOrphanedNotifications();

    // Listen for when notifications are received (app in foreground)
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 NOTIFICATION RECEIVED:', {
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        receivedAt: new Date().toLocaleString()
      });
    });

    // Listen for when user taps on notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const plantId = response.notification.request.content.data.plantId;
      console.log('👆 NOTIFICATION TAPPED:', {
        plantId: plantId,
        title: response.notification.request.content.title,
        tappedAt: new Date().toLocaleString()
      });
      // Navigate to MyPlants and highlight or scroll to the plant, or show details
      // You can implement navigation logic here as needed
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
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
            <Stack.Screen
              name="PlantCalendar"
              component={PlantCalendarScreen}
              options={{ title: 'Plant Calendar' }}
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