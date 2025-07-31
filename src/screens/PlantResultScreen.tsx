import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, Portal, Dialog } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { savePlant, addWateringEvent } from '../storage/plantStorage';
import { updateWateringSchedule } from '../logic/wateringSchedule';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { SavedPlant } from '../storage/plantStorage';
import { getSuggestedWateringFrequency, WateringFrequencyResponse } from '../services/openaiApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlantResult'>;
  route: RouteProp<RootStackParamList, 'PlantResult'>;
};

export default function PlantResultScreen({ navigation, route }: Props) {
  const { plantData } = route.params;
  const [wateringFrequency, setWateringFrequency] = useState('1');
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wateringTime, setWateringTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // New state for suggested watering frequency
  const [suggestedFrequency, setSuggestedFrequency] = useState<WateringFrequencyResponse | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Load suggested watering frequency when component mounts
  useEffect(() => {
    if (plantData?.suggestions?.[0]) {
      loadSuggestedFrequency();
    }
  }, [plantData]);

  const loadSuggestedFrequency = async () => {
    if (!plantData?.suggestions?.[0]) return;
    
    console.log('🌱 PLANT RESULT SCREEN: Loading suggested watering frequency');
    console.log('   Plant data available:', !!plantData);
    console.log('   Plant name:', plantData.suggestions[0].plant_name);
    console.log('   Scientific name:', plantData.suggestions[0].plant_details.scientific_name);
    
    try {
      setLoadingSuggestion(true);
      console.log('   Setting loading state to true');
      
      const suggestion = await getSuggestedWateringFrequency(
        plantData.suggestions[0].plant_name,
        plantData.suggestions[0].plant_details.scientific_name
      );
      
      console.log('✅ PLANT RESULT SCREEN: Received suggestion from API');
      console.log('   Suggestion:', JSON.stringify(suggestion, null, 2));
      
      setSuggestedFrequency(suggestion);
      setWateringFrequency(suggestion.suggestedFrequency.toString());
      
      console.log('   Updated UI state with suggested frequency:', suggestion.suggestedFrequency);
    } catch (error) {
      console.error('❌ PLANT RESULT SCREEN: Error loading suggested frequency:', error);
      console.log('   Keeping default frequency of 1 due to API failure');
      // Keep default frequency of 1 if API fails
    } finally {
      setLoadingSuggestion(false);
      console.log('   Setting loading state to false');
    }
  };

  const handleFrequencyChange = (value: string) => {
    console.log('🌱 PLANT RESULT SCREEN: User changed watering frequency');
    console.log('   New value:', value);
    console.log('   Previous value:', wateringFrequency);
    
    setWateringFrequency(value);
    
    // Check if the user's input deviates significantly from the suggestion
    if (suggestedFrequency && value) {
      const userFrequency = parseInt(value, 10);
      const suggested = suggestedFrequency.suggestedFrequency;
      const deviation = Math.abs(userFrequency - suggested);
      const deviationPercentage = (deviation / suggested) * 100;
      
      console.log('   User frequency:', userFrequency);
      console.log('   Suggested frequency:', suggested);
      console.log('   Deviation:', deviation);
      console.log('   Deviation percentage:', deviationPercentage.toFixed(1) + '%');
      
      // Show warning if deviation is more than 50%
      if (deviationPercentage > 50) {
        console.log('⚠️  WARNING: Significant deviation detected, showing warning dialog');
        setWarningMessage(
          `Your selected frequency of ${userFrequency} days differs significantly from the suggested ${suggested} days. This could affect your plant's health.`
        );
        setShowWarningDialog(true);
      } else {
        console.log('✅ Frequency change is within acceptable range');
      }
    } else {
      console.log('   No suggested frequency available for comparison');
    }
  };

  // Defensive check for missing or malformed data
  if (!plantData || !Array.isArray(plantData.suggestions) || plantData.suggestions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 16 }}>No plant data found</Text>
        <Text variant="bodyMedium">Sorry, we couldn't identify the plant. Please try again with a different image.</Text>
        <Button mode="contained" style={{ marginTop: 24 }} onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  const handleSavePlant = async () => {
    if (!plantData.suggestions[0]) return;
    try {
      setSaving(true);
      const timeOfDay = wateringTime.toTimeString().slice(0,5); // "HH:MM"
      
      // Create a date object for today with the user's selected watering time
      const initialWateringDate = new Date();
      const [hour, minute] = wateringTime.toTimeString().slice(0,5).split(':').map(Number);
      initialWateringDate.setHours(hour, minute, 0, 0);
      
      const plant = {
        id: Date.now().toString(),
        name: plantData.suggestions[0].plant_name,
        scientificName: plantData.suggestions[0].plant_details.scientific_name,
        family: plantData.suggestions[0].plant_details.structured_name?.genus || '',
        imageUri: '',
        dateIdentified: new Date().toISOString(),
        wateringSchedule: wateringFrequency ? {
          frequency: parseInt(wateringFrequency, 10),
          lastWatered: initialWateringDate.toISOString(),
          timeOfDay,
        } : undefined,
      };
      const savedPlant = await savePlant(plant);
      if (plant.wateringSchedule) {
        // Record the initial watering event with the user's selected time
        await addWateringEvent(savedPlant.id, initialWateringDate);
        await scheduleWateringNotification(savedPlant);
      }
      setShowDialog(true);
    } catch (error) {
      console.error('Error saving plant:', error);
    } finally {
      setSaving(false);
    }
  };

  async function scheduleWateringNotification(plant: SavedPlant) {
    if (!plant.wateringSchedule) return;
    
    console.log('🌱 SCHEDULING NOTIFICATION for plant:', plant.name);
    
    // Cancel any existing notifications for this plant
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const plantNotification = existingNotifications.find(
      notification => notification.content.data?.plantId === plant.id
    );
    if (plantNotification) {
      await Notifications.cancelScheduledNotificationAsync(plantNotification.identifier);
      console.log('❌ Cancelled existing notification for plant:', plant.name);
    }

    const [hour, minute] = plant.wateringSchedule.timeOfDay.split(':').map(Number);
    const now = new Date();
    const lastWatered = new Date(plant.wateringSchedule.lastWatered);
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(nextWatering.getDate() + plant.wateringSchedule.frequency);
    nextWatering.setHours(hour, minute, 0, 0);

    // Check if the scheduled time has already passed today
    const todayScheduledTime = new Date();
    todayScheduledTime.setHours(hour, minute, 0, 0);
    
    if (todayScheduledTime <= now) {
      // Time has passed today, schedule for tomorrow
      nextWatering.setDate(nextWatering.getDate() + 1);
      console.log('📅 Scheduled time has passed today, scheduling for tomorrow');
    } else {
      // Time is still coming up today, schedule for today
      nextWatering.setDate(now.getDate());
      nextWatering.setMonth(now.getMonth());
      nextWatering.setFullYear(now.getFullYear());
      console.log('📅 Scheduled time is still coming up today, scheduling for today');
    }

    const secondsUntilNotification = Math.max(10, Math.floor((nextWatering.getTime() - now.getTime()) / 1000));
    const minutesUntilNotification = Math.floor(secondsUntilNotification / 60);
    const hoursUntilNotification = Math.floor(minutesUntilNotification / 60);
    const daysUntilNotification = Math.floor(hoursUntilNotification / 24);

    console.log('⏰ NOTIFICATION SCHEDULING DETAILS:');
    console.log('   Plant:', plant.name);
    console.log('   Current time:', now.toLocaleString());
    console.log('   Current time (ISO):', now.toISOString());
    console.log('   Scheduled for:', nextWatering.toLocaleString());
    console.log('   Scheduled for (ISO):', nextWatering.toISOString());
    console.log('   Time until notification:', {
      seconds: secondsUntilNotification,
      minutes: minutesUntilNotification,
      hours: hoursUntilNotification,
      days: daysUntilNotification
    });
    console.log('   Timezone offset (minutes):', now.getTimezoneOffset());
    console.log('   Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time to water ${plant.name}!`,
        body: `Don't forget to water your ${plant.name} today.`,
        data: { plantId: plant.id },
      },
      trigger: {
        type: 'timeInterval',
        seconds: secondsUntilNotification,
      } as any, // Expo SDK 53+ may require this cast
    });

    console.log('✅ NOTIFICATION SCHEDULED SUCCESSFULLY:');
    console.log('   Plant:', plant.name);
    console.log('   Notification ID:', notificationId);
    console.log('   Will fire at:', nextWatering.toLocaleString());
    console.log('   In:', `${daysUntilNotification}d ${hoursUntilNotification % 24}h ${minutesUntilNotification % 60}m`);
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {plantData.suggestions[0]?.plant_name}
          </Text>
          <Text variant="bodyLarge" style={styles.scientificName}>
            {plantData.suggestions[0]?.plant_details.scientific_name}
          </Text>
          <Text variant="bodyMedium" style={styles.family}>
            Family: {plantData.suggestions[0]?.plant_details.structured_name?.genus}
          </Text>
          <Text variant="bodyMedium" style={styles.probability}>
            Confidence: {Math.round(plantData.suggestions[0]?.probability * 100)}%
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Watering Schedule
          </Text>
          <TextInput
            label="Watering Frequency (days)"
            value={wateringFrequency}
            onChangeText={handleFrequencyChange}
            keyboardType="numeric"
            style={styles.input}
            disabled={loadingSuggestion}
          />
          {loadingSuggestion && (
            <Text variant="bodySmall" style={{ color: '#666', marginTop: 4 }}>
              Loading suggested watering frequency...
            </Text>
          )}
          {suggestedFrequency && (
            <View style={{ marginTop: 8 }}>
              <Text variant="bodySmall" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                Suggested frequency: {suggestedFrequency.suggestedFrequency} days
              </Text>
              <Text variant="bodySmall" style={{ color: '#666', marginTop: 2 }}>
                {suggestedFrequency.reasoning}
              </Text>
              <Button
                mode="text"
                onPress={loadSuggestedFrequency}
                disabled={loadingSuggestion}
                style={{ marginTop: 8 }}
              >
                Regenerate Suggestion
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={{ marginBottom: 8 }}>
        Select Watering Time ({wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
      </Button>
      {showTimePicker && (
        <DateTimePicker
          value={wateringTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setWateringTime(selectedTime);
          }}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSavePlant}
        style={styles.button}
        loading={saving}
        disabled={saving}
      >
        Save Plant
      </Button>

      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => {
            setShowDialog(false);
            navigation.navigate('MyPlants');
          }}
        >
          <Dialog.Title>Success!</Dialog.Title>
          <Dialog.Content>
            <Text>Plant saved successfully!</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setShowDialog(false);
                navigation.navigate('MyPlants');
              }}
            >
              View My Plants
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={showWarningDialog}
          onDismiss={() => setShowWarningDialog(false)}
        >
          <Dialog.Title>Warning</Dialog.Title>
          <Dialog.Content>
            <Text>{warningMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowWarningDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  scientificName: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  family: {
    marginBottom: 4,
  },
  probability: {
    marginTop: 8,
    color: '#666',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 