import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, IconButton, Portal, Dialog } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { getPlants, deletePlant, SavedPlant, updatePlant } from '../storage/plantStorage';
import { calculateWateringStatus, markAsWatered } from '../logic/wateringSchedule';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyPlants'>;
};

export default function MyPlantsScreen({ navigation }: Props) {
  const [plants, setPlants] = useState<SavedPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<SavedPlant | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    const savedPlants = await getPlants();
    setPlants(savedPlants);
  };

  const handleDeletePlant = async () => {
    if (!selectedPlant) return;

    try {
      await deletePlant(selectedPlant.id);
      setPlants(plants.filter((p) => p.id !== selectedPlant.id));
      setShowDeleteDialog(false);
      setSelectedPlant(null);
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  const handleWaterPlant = async (plant: SavedPlant) => {
    try {
      const updatedPlant = markAsWatered(plant);
      await updatePlant(updatedPlant);
      setPlants(plants.map((p) => (p.id === plant.id ? updatedPlant : p)));
    } catch (error) {
      console.error('Error updating plant:', error);
    }
  };

  const renderPlantCard = ({ item: plant }: { item: SavedPlant }) => {
    const wateringStatus = calculateWateringStatus(plant);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge">{plant.name}</Text>
            <IconButton
              icon="delete"
              onPress={() => {
                setSelectedPlant(plant);
                setShowDeleteDialog(true);
              }}
            />
          </View>
          <Text variant="bodyMedium" style={styles.scientificName}>
            {plant.scientificName}
          </Text>
          <Text variant="bodySmall">Family: {plant.family}</Text>
          
          {plant.wateringSchedule && (
            <View style={styles.wateringInfo}>
              <Text
                variant="bodyMedium"
                style={[
                  styles.wateringStatus,
                  wateringStatus.needsWatering && styles.needsWatering,
                ]}
              >
                {wateringStatus.needsWatering
                  ? 'Needs watering!'
                  : `Water in ${wateringStatus.daysUntilWatering} days`}
              </Text>
              <Text variant="bodySmall">
                Last watered: {wateringStatus.lastWatered}
              </Text>
              <Button
                mode="contained"
                onPress={() => handleWaterPlant(plant)}
                style={styles.waterButton}
              >
                Mark as Watered
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={plants}
        renderItem={renderPlantCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Plant</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this plant?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeletePlant}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scientificName: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  wateringInfo: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  wateringStatus: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  needsWatering: {
    color: '#d32f2f',
  },
  waterButton: {
    marginTop: 8,
  },
}); 