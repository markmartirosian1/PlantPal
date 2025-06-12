import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Sample data
  const today = new Date();
  const todayDateNum = today.getDate();
  const todayMonth = today.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  
  const upcomingActions = [
    {
      date: 23,
      month: 'NOV',
      action: 'Change Soil',
      time: '3:00 PM',
      type: 'soil'
    },
    {
      date: 24,
      month: 'NOV', 
      action: 'Water Plant',
      time: '26 Nov',
      type: 'water'
    }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (day) => {
    if (!day) return false;
    const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && 
                          currentMonth.getFullYear() === today.getFullYear();
    return isCurrentMonth && day === todayDateNum;
  };

  const hasAction = (day) => {
    // Sample logic - you'd implement actual action checking here
    return day === 23 || day === 24 || day === 30;
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule calendar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          {/* Month Navigation */}
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={() => navigateMonth(-1)}>
              <Text style={styles.navButton}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth(1)}>
              <Text style={styles.navButton}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Days of Week */}
          <View style={styles.daysOfWeekContainer}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.dayOfWeek}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isToday(day) && styles.todayCell,
                  hasAction(day) && styles.actionCell
                ]}
                disabled={!day}
              >
                {day && (
                  <Text style={[
                    styles.dayText,
                    isToday(day) && styles.todayText,
                    hasAction(day) && !isToday(day) && styles.actionText
                  ]}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today Section */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today</Text>
          <View style={styles.todayCard}>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateNumber}>{todayDateNum}</Text>
              <Text style={styles.dateMonth}>{todayMonth}</Text>
            </View>
            <View style={styles.todayContent}>
              <Text style={styles.noActionsText}>No Actions</Text>
              <Text style={styles.dateRange}>23 Nov - 24 Nov</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Actions */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Actions</Text>
          {upcomingActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <View style={styles.actionDate}>
                <Text style={styles.actionDateNumber}>{action.date}</Text>
                <Text style={styles.actionDateMonth}>{action.month}</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.action}</Text>
                <Text style={styles.actionTime}>{action.time}</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9C3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 24,
  },
  calendarContainer: {
    backgroundColor: '#FEF08A',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    fontSize: 24,
    color: '#333333',
    paddingHorizontal: 10,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    width: 40,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  todayCell: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  actionCell: {
    backgroundColor: '#60A5FA',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#333333',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  todaySection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  todayCard: {
    backgroundColor: '#FEF08A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDisplay: {
    marginRight: 16,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  dateMonth: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  todayContent: {
    flex: 1,
  },
  noActionsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  dateRange: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  upcomingSection: {
    paddingHorizontal: 16,
    marginBottom: 80,
  },
  actionCard: {
    backgroundColor: '#E7FAE7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionDate: {
    marginRight: 16,
    alignItems: 'center',
  },
  actionDateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionDateMonth: {
    fontSize: 12,
    color: '#4CAF50',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  actionTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 20,
    color: '#4CAF50',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    backgroundColor: '#F87171',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});