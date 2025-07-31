import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getPlants, SavedPlant, WateringEvent } from '../storage/plantStorage';
import { calculateWateringStatus } from '../logic/wateringSchedule';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlantCalendar'>;
};

interface CalendarDay {
  date: Date;
  plants: Array<{
    plant: SavedPlant;
    wateringTime: string;
    isPastWatering: boolean;
    isActualWatering: boolean;
  }>;
}

export default function PlantCalendarScreen({ navigation }: Props) {
  const [plants, setPlants] = useState<SavedPlant[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    loadPlants();
  }, []);

  useEffect(() => {
    generateCalendar();
  }, [plants, currentMonth]);

  const loadPlants = async () => {
    const savedPlants = await getPlants();
    setPlants(savedPlants);
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: CalendarDay[] = [];
    
    // Add empty days for padding at the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ date: new Date(year, month, -firstDayOfMonth + i + 1), plants: [] });
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayPlants: Array<{ plant: SavedPlant; wateringTime: string; isPastWatering: boolean; isActualWatering: boolean }> = [];
      
      // Check each plant for actual watering events and future scheduled waterings
      plants.forEach(plant => {
        if (plant.wateringSchedule) {
          const today = new Date();
          const startOfYear = new Date(year, 0, 1); // January 1st
          const endOfYear = new Date(year, 11, 31); // December 31st
          
          // Check for actual watering events in the watering history
          const wateringHistory = plant.wateringSchedule.wateringHistory || [];
          
          // Show all past watering events from the first watering onwards
          wateringHistory.forEach((wateringEvent: WateringEvent) => {
            const wateringDate = new Date(wateringEvent.timestamp);
            
            // Check if this watering event falls on the current calendar day
            if (date.toDateString() === wateringDate.toDateString()) {
              dayPlants.push({
                plant,
                wateringTime: wateringEvent.timeOfDay,
                isPastWatering: wateringDate < today,
                isActualWatering: true
              });
            }
          });
          
          // Calculate future scheduled waterings based on the last actual watering
          if (wateringHistory.length > 0) {
            const lastWateringEvent = wateringHistory[wateringHistory.length - 1];
            const lastWateringDate = new Date(lastWateringEvent.timestamp);
            const frequency = plant.wateringSchedule.frequency;
            const timeOfDay = plant.wateringSchedule.timeOfDay;
            
            // Calculate future waterings from the last actual watering
            let nextScheduledWatering = new Date(lastWateringDate);
            nextScheduledWatering.setDate(nextScheduledWatering.getDate() + frequency);
            
            // Continue calculating future waterings until we reach the end of the year
            while (nextScheduledWatering <= endOfYear) {
              // Check if this scheduled watering falls on the current calendar day
              if (date.toDateString() === nextScheduledWatering.toDateString()) {
                // Only add if it's in the future and not already an actual watering
                const isAlreadyActualWatering = wateringHistory.some(event => {
                  const eventDate = new Date(event.timestamp);
                  return eventDate.toDateString() === nextScheduledWatering.toDateString();
                });
                
                if (!isAlreadyActualWatering && nextScheduledWatering > today) {
                  dayPlants.push({
                    plant,
                    wateringTime: timeOfDay,
                    isPastWatering: false,
                    isActualWatering: false
                  });
                }
              }
              
              // Move to next scheduled watering
              nextScheduledWatering.setDate(nextScheduledWatering.getDate() + frequency);
            }
          }
        }
      });
      
      days.push({ date, plants: dayPlants });
    }
    
    setCalendarDays(days);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderCalendarDay = (day: CalendarDay) => {
    const isCurrentMonthDay = isCurrentMonth(day.date);
    const isTodayDate = isToday(day.date);
    
    return (
      <View key={day.date.toISOString()} style={[
        styles.calendarDay,
        !isCurrentMonthDay && styles.otherMonthDay,
        isTodayDate && styles.today
      ]}>
        <Text style={[
          styles.dayNumber,
          !isCurrentMonthDay && styles.otherMonthText,
          isTodayDate && styles.todayText
        ]}>
          {getDayNumber(day.date)}
        </Text>
        {day.plants.length > 0 && (
          <View style={styles.plantsContainer}>
            {day.plants.slice(0, 2).map((plantInfo, index) => (
              <View key={index} style={styles.plantItem}>
                <Text style={[
                  styles.plantName, 
                  plantInfo.isPastWatering && styles.pastPlantName,
                  plantInfo.isActualWatering && styles.actualWateringName
                ]} numberOfLines={1}>
                  {plantInfo.isActualWatering ? '✓ ' : ''}{plantInfo.plant.name}
                </Text>
                <Text style={[
                  styles.wateringTime,
                  plantInfo.isPastWatering && styles.pastWateringTime,
                  plantInfo.isActualWatering && styles.actualWateringTime
                ]}>
                  {plantInfo.wateringTime}
                </Text>
              </View>
            ))}
            {day.plants.length > 2 && (
              <Text style={styles.morePlants}>
                +{day.plants.length - 2} more
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={goToPreviousMonth} />
        <Text variant="headlineSmall" style={styles.monthTitle}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <IconButton icon="chevron-right" onPress={goToNextMonth} />
      </View>

      <View style={styles.weekDaysHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.weekDayHeader}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView style={styles.calendarContainer}>
        <View style={styles.calendarGrid}>
          {calendarDays.map(renderCalendarDay)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  monthTitle: {
    fontWeight: 'bold',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  calendarContainer: {
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 4,
    backgroundColor: '#fff',
  },
  otherMonthDay: {
    backgroundColor: '#f5f5f5',
  },
  today: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  otherMonthText: {
    color: '#999',
  },
  todayText: {
    color: '#4CAF50',
  },
  plantsContainer: {
    flex: 1,
  },
  plantItem: {
    marginBottom: 2,
  },
  plantName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  wateringTime: {
    fontSize: 7,
    color: '#666',
  },
  morePlants: {
    fontSize: 7,
    color: '#999',
    fontStyle: 'italic',
  },
  pastPlantName: {
    color: '#999',
    fontStyle: 'italic',
  },
  pastWateringTime: {
    color: '#999',
    fontStyle: 'italic',
  },
  actualWateringName: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  actualWateringTime: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
}); 