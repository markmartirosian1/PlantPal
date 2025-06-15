import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, Portal, Dialog } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { savePlant } from '../storage/plantStorage';
import { updateWateringSchedule } from '../logic/wateringSchedule';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlantResult'>;
  route: RouteProp<RootStackParamList, 'PlantResult'>;
};

export default function PlantResultScreen({ navigation, route }: Props) {
  const { plantData } = route.params;
  const [wateringFrequency, setWateringFrequency] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);

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
      const plant = {
        id: Date.now().toString(),
        name: plantData.suggestions[0].plant_name,
        scientificName: plantData.suggestions[0].plant_details.scientific_name,
        family: plantData.suggestions[0].plant_details.structured_name?.genus || '',
        imageUri: '', // You'll need to pass this from the previous screen
        dateIdentified: new Date().toISOString(),
      };

      if (wateringFrequency) {
        const frequency = parseInt(wateringFrequency, 10);
        if (!isNaN(frequency)) {
          const plantWithSchedule = updateWateringSchedule(plant, frequency);
          await savePlant(plantWithSchedule);
        }
      } else {
        await savePlant(plant);
      }

      setShowDialog(true);
    } catch (error) {
      console.error('Error saving plant:', error);
    } finally {
      setSaving(false);
    }
  };

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
        <Dialog visible={showDialog} onDismiss={() => navigation.navigate('MyPlants')}>
          <Dialog.Title>Success!</Dialog.Title>
          <Dialog.Content>
            <Text>Plant saved successfully!</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => navigation.navigate('MyPlants')}>View My Plants</Button>
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