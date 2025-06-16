import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, Portal, Dialog } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { savePlant } from '../storage/plantStorage';
import { updateWateringSchedule } from '../logic/wateringSchedule';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { SavedPlant } from '../storage/plantStorage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlantResult'>;
  route: RouteProp<RootStackParamList, 'PlantResult'>;
};

export default function PlantResultScreen({ navigation, route }: Props) {
  const { plantData } = route.params;
  const [wateringFrequency, setWateringFrequency] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wateringTime, setWateringTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      const plant = {
        id: Date.now().toString(),
        name: plantData.suggestions[0].plant_name,
        scientificName: plantData.suggestions[0].plant_details.scientific_name,
        family: plantData.suggestions[0].plant_details.structured_name?.genus || '',
        imageUri: '',
        dateIdentified: new Date().toISOString(),
        wateringSchedule: wateringFrequency ? {
          frequency: parseInt(wateringFrequency, 10),
          lastWatered: new Date().toISOString(),
          timeOfDay,
        } : undefined,
      };
      await savePlant(plant);
      if (plant.wateringSchedule) {
        await scheduleWateringNotification(plant);
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
    const [hour, minute] = plant.wateringSchedule.timeOfDay.split(':').map(Number);
    const lastWatered = new Date(plant.wateringSchedule.lastWatered);
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(nextWatering.getDate() + plant.wateringSchedule.frequency);
    nextWatering.setHours(hour, minute, 0, 0);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time to water ${plant.name}!`,
        body: `Don't forget to water your ${plant.name} today.`,
        data: { plantId: plant.id },
      },
      trigger: nextWatering,
    });
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
            onChangeText={setWateringFrequency}
            keyboardType="numeric"
            style={styles.input}
          />
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