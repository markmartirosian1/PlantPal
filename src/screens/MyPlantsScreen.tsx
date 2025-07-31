import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, IconButton, Portal, Dialog } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; 
import { getPlants, deletePlant, SavedPlant, updatePlant, addWateringEvent } from '../storage/plantStorage';
import { calculateWateringStatus, markAsWatered } from '../logic/wateringSchedule';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyPlants'>;
};

export default function MyPlantsScreen({ navigation }: Props) {
  const [plants, setPlants] = useState<SavedPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<SavedPlant | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDelayPicker, setShowDelayPicker] = useState(false);
  const [delayPlant, setDelayPlant] = useState<SavedPlant | null>(null);
  const [delayTime, setDelayTime] = useState(new Date());
  const [showWateredDialog, setShowWateredDialog] = useState(false);
  const [wateredPlantInfo, setWateredPlantInfo] = useState<{ name: string; nextWatering: string } | null>(null);
  const [showWateredTimePicker, setShowWateredTimePicker] = useState(false);
  const [wateredPlant, setWateredPlant] = useState<SavedPlant | null>(null);
  const [wateredTime, setWateredTime] = useState(new Date());

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    console.log('🔍 TEST: loadPlants function called');
    alert('TEST: loadPlants function called');
    const savedPlants = await getPlants();
    setPlants(savedPlants);
  };

  const handleDeletePlant = async () => {
    if (!selectedPlant) return;

    try {
      // Cancel any scheduled notifications for this plant
      const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const plantNotifications = existingNotifications.filter(
        notification => notification.content.data?.plantId === selectedPlant.id
      );
      
      // Cancel all notifications for this plant
      for (const notification of plantNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log('❌ Cancelled notification for deleted plant:', selectedPlant.name, 'ID:', notification.identifier);
      }
      
      if (plantNotifications.length > 0) {
        console.log(`🗑️ Cancelled ${plantNotifications.length} notification(s) for deleted plant: ${selectedPlant.name}`);
      }

      // Delete the plant from storage
      await deletePlant(selectedPlant.id);
      setPlants(plants.filter((p) => p.id !== selectedPlant.id));
      setShowDeleteDialog(false);
      setSelectedPlant(null);
      
      console.log('✅ Plant deleted successfully:', selectedPlant.name);
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  const handleWaterPlant = async (plant: SavedPlant) => {
    alert('TEST: Mark as Watered button clicked for: ' + plant.name);
    console.log('💧 MARK AS WATERED button clicked for plant:', plant.name);
    
    // Use the original time if it exists (from a delay), otherwise use the current time
    let defaultTime: Date;
    if (plant.wateringSchedule?.originalTimeOfDay) {
      // Use the original time that was stored when delay was applied
      const [hour, minute] = plant.wateringSchedule.originalTimeOfDay.split(':').map(Number);
      defaultTime = new Date();
      defaultTime.setHours(hour, minute, 0, 0);
      console.log('🔍 DEBUG: Using original time as default:', plant.wateringSchedule.originalTimeOfDay);
    } else {
      // Use the current watering time (no delay was applied)
      const [hour, minute] = plant.wateringSchedule!.timeOfDay.split(':').map(Number);
      defaultTime = new Date();
      defaultTime.setHours(hour, minute, 0, 0);
      console.log('🔍 DEBUG: Using current time as default:', plant.wateringSchedule!.timeOfDay);
    }
    
    setWateredTime(defaultTime);
    setWateredPlant(plant);
    setShowWateredTimePicker(true);
  };

  const handleDelayPlant = (plant: SavedPlant) => {
    alert('handleDelayPlant function called for: ' + plant.name);
    console.log('🔍 DEBUG: handleDelayPlant function called');
    console.log('🔍 DEBUG: Plant name:', plant.name);
    console.log('⏰ DELAY button clicked for plant:', plant.name);
    setDelayPlant(plant);
    setShowDelayPicker(true);
    console.log('🔍 DEBUG: showDelayPicker set to true');
    // Force console output
    setTimeout(() => {
      console.log('🔍 DEBUG: DELAY SETUP COMPLETE - showDelayPicker should be true');
    }, 100);
  };

  // Add useEffect to monitor showDelayPicker state
  useEffect(() => {
    console.log('🔍 DEBUG: showDelayPicker state changed to:', showDelayPicker);
  }, [showDelayPicker]);

  const handleDelayConfirmWithTime = async (selectedTime: Date) => {
    console.log('🔍 DEBUG: HANDLE DELAY CONFIRM WITH TIME CALLED');
    console.log('🔍 DEBUG: DELAY CONFIRM - Plant:', delayPlant?.name, 'Time:', selectedTime.toLocaleTimeString());
    if (delayPlant && selectedTime) {
      console.log('🔍 DEBUG: DELAY CONFIRMED - Processing delay for plant:', delayPlant.name);
      console.log('⏰ DELAY CONFIRMED for plant:', delayPlant.name, 'at time:', selectedTime.toLocaleTimeString());
      const [hour, minute] = [selectedTime.getHours(), selectedTime.getMinutes()];
      
      // Store the original time in the plant data for later restoration
      const originalTime = delayPlant.wateringSchedule!.timeOfDay;
      const updatedPlant = {
        ...delayPlant,
        wateringSchedule: {
          ...delayPlant.wateringSchedule!,
          timeOfDay: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          lastWatered: delayPlant.wateringSchedule!.lastWatered,
          originalTimeOfDay: originalTime, // Store the original time
        },
      };
      console.log('🔍 DEBUG: Updating plant with new watering time:', updatedPlant.wateringSchedule.timeOfDay);
      console.log('🔍 DEBUG: Updating plant with new watering time:', updatedPlant.wateringSchedule.timeOfDay);
      console.log('🔍 DEBUG: Original time stored:', originalTime);
      await updatePlant(updatedPlant);
      console.log('🔍 DEBUG: Plant updated successfully, scheduling notification');
      console.log('🔍 DEBUG: Plant updated successfully, scheduling notification');
      await scheduleWateringNotification(updatedPlant);
      setPlants(plants.map((p) => (p.id === updatedPlant.id ? updatedPlant : p)));
      setShowDelayPicker(false);
      setDelayPlant(null);
      console.log('✅ DELAY PROCESS COMPLETED SUCCESSFULLY for plant:', delayPlant.name);
      console.log('✅ DELAY PROCESS COMPLETED SUCCESSFULLY for plant:', delayPlant.name);
    } else {
      console.log('🔍 DEBUG: handleDelayConfirmWithTime called but delayPlant or selectedTime is missing');
      console.log('🔍 DEBUG: handleDelayConfirmWithTime called but delayPlant or selectedTime is missing');
      console.log('🔍 DEBUG: delayPlant:', delayPlant?.name);
      console.log('🔍 DEBUG: selectedTime:', selectedTime?.toLocaleTimeString());
    }
  };

  const handleDelayConfirm = async () => {
    if (delayPlant) {
      console.log('⏰ DELAY CONFIRMED for plant:', delayPlant.name, 'at time:', delayTime.toLocaleTimeString());
      const [hour, minute] = [delayTime.getHours(), delayTime.getMinutes()];
      const updatedPlant = {
        ...delayPlant,
        wateringSchedule: {
          ...delayPlant.wateringSchedule!,
          timeOfDay: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          lastWatered: delayPlant.wateringSchedule!.lastWatered,
        },
      };
      await updatePlant(updatedPlant);
      await scheduleWateringNotification(updatedPlant);
      setPlants(plants.map((p) => (p.id === updatedPlant.id ? updatedPlant : p)));
      setShowDelayPicker(false);
      setDelayPlant(null);
    }
  };

  const handleWateredTimeConfirm = async () => {
    if (wateredPlant) {
      console.log('💧 WATERED TIME CONFIRMED for plant:', wateredPlant.name, 'at time:', wateredTime.toLocaleTimeString());
      
      // Record the actual watering event with the current time (when button was pressed)
      const actualWateringTime = new Date(); // Current time when marked as watered
      await addWateringEvent(wateredPlant.id, actualWateringTime);
      
      // For future scheduled waterings, use the time the user selected
      let timeToUse = wateredTime;
      if (wateredPlant.wateringSchedule?.originalTimeOfDay) {
        const [originalHour, originalMinute] = wateredPlant.wateringSchedule.originalTimeOfDay.split(':').map(Number);
        timeToUse = new Date();
        timeToUse.setHours(originalHour, originalMinute, 0, 0);
        console.log('🔍 DEBUG: Using original time after delay:', wateredPlant.wateringSchedule.originalTimeOfDay);
      } else {
        console.log('🔍 DEBUG: Using selected time for future waterings');
      }
      
      const [hour, minute] = [timeToUse.getHours(), timeToUse.getMinutes()];
      const updatedPlant = {
        ...wateredPlant,
        wateringSchedule: {
          ...wateredPlant.wateringSchedule!,
          timeOfDay: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          lastWatered: actualWateringTime.toISOString(), // Use actual watering time
          // Remove the originalTimeOfDay since we're resetting to the original schedule
          originalTimeOfDay: undefined,
        },
      };
      
      try {
        await updatePlant(updatedPlant);
        setPlants(plants.map((p) => (p.id === wateredPlant.id ? updatedPlant : p)));
        await scheduleWateringNotification(updatedPlant);
        
        // Calculate next watering time for user feedback (using the selected time for future)
        const nextWatering = new Date();
        nextWatering.setDate(nextWatering.getDate() + 1); // Next day
        nextWatering.setHours(hour, minute, 0, 0);
        
        setWateredPlantInfo({ 
          name: wateredPlant.name, 
          nextWatering: nextWatering.toLocaleString() 
        });
        setShowWateredDialog(true);
        setShowWateredTimePicker(false);
        setWateredPlant(null);
      } catch (error) {
        console.error('Error updating plant:', error);
      }
    }
  };

  async function scheduleWateringNotification(plant: SavedPlant) {
    console.log('🔍 FUNCTION CALLED - scheduleWateringNotification for:', plant.name);
    
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
                onPress={() => {
                  alert('TEST: Mark as Watered button clicked for: ' + plant.name);
                  console.log('💧 MARK AS WATERED button clicked for plant:', plant.name);
                  
                  // Use the original time if it exists (from a delay), otherwise use the current time
                  let defaultTime: Date;
                  if (plant.wateringSchedule?.originalTimeOfDay) {
                    // Use the original time that was stored when delay was applied
                    const [hour, minute] = plant.wateringSchedule.originalTimeOfDay.split(':').map(Number);
                    defaultTime = new Date();
                    defaultTime.setHours(hour, minute, 0, 0);
                    console.log('🔍 DEBUG: Using original time as default:', plant.wateringSchedule.originalTimeOfDay);
                  } else {
                    // Use the current watering time (no delay was applied)
                    const [hour, minute] = plant.wateringSchedule!.timeOfDay.split(':').map(Number);
                    defaultTime = new Date();
                    defaultTime.setHours(hour, minute, 0, 0);
                    console.log('🔍 DEBUG: Using current time as default:', plant.wateringSchedule!.timeOfDay);
                  }
                  
                  setWateredTime(defaultTime);
                  setWateredPlant(plant);
                  setShowWateredTimePicker(true);
                }}
                style={styles.waterButton}
              >
                Mark as Watered & Set Future Time
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  alert('Delay button pressed for: ' + plant.name);
                  console.log('🔍 DEBUG: Delay button pressed');
                  handleDelayPlant(plant);
                }}
                style={styles.waterButton}
              >
                Delay
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

      {showDelayPicker && (
        <DateTimePicker
          value={delayTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(_, selectedTime) => {
            console.log('🔍 DEBUG: DateTimePicker onChange triggered');
            console.log('⏰ DateTimePicker onChange triggered with time:', selectedTime?.toLocaleTimeString());
            
            // Only process if selectedTime is not null (user made a selection)
            if (selectedTime) {
              console.log('🔍 DEBUG: Selected time is valid, calling handleDelayConfirmWithTime');
              console.log('🔍 DEBUG: Selected time is valid, calling handleDelayConfirmWithTime');
              setShowDelayPicker(false);
              setDelayTime(selectedTime);
              // Call handleDelayConfirm with the selected time directly
              handleDelayConfirmWithTime(selectedTime);
            } else {
              console.log('🔍 DEBUG: Selected time is null (picker opened), keeping picker open');
              // Don't close the picker when selectedTime is null (picker just opened)
            }
          }}
        />
      )}

      {showWateredTimePicker && (
        <View style={styles.timePickerContainer}>
          <Text style={styles.timePickerLabel}>
            Set time for future watering schedules:
          </Text>
          <DateTimePicker
            value={wateredTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(_, selectedTime) => {
              console.log('💧 WATERED TIMEPICKER onChange triggered');
              console.log('💧 WATERED TIMEPICKER - Selected time:', selectedTime?.toLocaleTimeString());
              
              // Only process if selectedTime is not null (user made a selection)
              if (selectedTime) {
                console.log('💧 WATERED TIMEPICKER - Valid time selected, calling handleWateredTimeConfirm');
                setShowWateredTimePicker(false);
                setWateredTime(selectedTime);
                handleWateredTimeConfirm();
              } else {
                console.log('💧 WATERED TIMEPICKER - Selected time is null (picker opened), keeping picker open');
                // Don't close the picker when selectedTime is null (picker just opened)
              }
            }}
          />
        </View>
      )}

      <Portal>
        <Dialog visible={showWateredDialog} onDismiss={() => setShowWateredDialog(false)}>
          <Dialog.Title>🎉 Great Job!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
              You've successfully watered <Text style={{ fontWeight: 'bold' }}>{wateredPlantInfo?.name}</Text>!
            </Text>
            <Text variant="bodyMedium">
              Next watering reminder: <Text style={{ fontWeight: 'bold' }}>{wateredPlantInfo?.nextWatering}</Text>
            </Text>
            <Text variant="bodySmall" style={{ marginTop: 8, fontStyle: 'italic' }}>
              Current watering recorded at actual time. Future waterings will be scheduled at your selected time.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowWateredDialog(false)}>OK</Button>
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
  timePickerContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  timePickerLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 