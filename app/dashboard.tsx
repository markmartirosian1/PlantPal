import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Sample plant data
  const plantData = {
    name: 'Swiss Cheese Plant',
    scientificName: 'Monstera Deliciosa',
    nextWatering: '2 days',
    nextSoilChange: '90 days',
  };

  // Sample tips data
  const tips = [
    {
      title: 'Water Plant More',
      description: 'This kind of plant loves water! They\'re from the Amazon where it rains year-round every day. Make sure to give this plant plenty of water every day to make it feel at home.',
      icon: '🌿',
    },
    {
      title: 'Cloud Lover',
      description: 'This plant loves clouds and overcast days! The indirect light provided by the direct ways of the sun are mindful to this plant.',
      icon: '☁️',
    },
    {
      title: 'Temperature',
      description: 'The kind of plant loves the warm weather, just like in the rainforest! So please make sure to keep the temperature of the room in the 70s.',
      icon: '🌡️',
    },
  ];

  const handleLogout = () => {
    router.replace('/');
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.temperature}>75° F</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Plant Display */}
      <View style={styles.plantContainer}>
        <View style={styles.windowFrame}>
          <View style={styles.windowGrid}>
            <View style={styles.windowPane}></View>
            <View style={styles.windowPane}></View>
            <View style={styles.windowPane}></View>
            <View style={styles.windowPane}></View>
          </View>
          
          {/* Plant illustration */}
          <View style={styles.plantWrapper}>
            <View style={styles.pot}>
              <View style={styles.plant}>
                <View style={[styles.leaf, styles.leafLeft]}></View>
                <View style={[styles.leaf, styles.leafRight]}></View>
                <View style={[styles.leaf, styles.leafTop]}></View>
              </View>
            </View>
          </View>
        </View>

        {/* Plant Info */}
        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{plantData.name}</Text>
          <Text style={styles.scientificName}>{plantData.scientificName}</Text>
        </View>
      </View>

      {/* Care Schedule */}
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleIcon}>💧</Text>
          <View>
            <Text style={styles.scheduleTitle}>Next Watering</Text>
            <Text style={styles.scheduleTime}>{plantData.nextWatering}</Text>
          </View>
        </View>

        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleIcon}>🌱</Text>
          <View>
            <Text style={styles.scheduleTitle}>Next Soil Change</Text>
            <Text style={styles.scheduleTime}>{plantData.nextSoilChange}</Text>
          </View>
        </View>
      </View>

      {/* Tips Scroller */}
      <View style={styles.tipsContainer}>
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <TouchableOpacity onPress={prevTip} style={styles.tipNavButton}>
              <Text style={styles.tipNavText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.tipContent}>
              <View style={styles.tipIconContainer}>
                <Text style={styles.tipIcon}>{tips[currentTipIndex].icon}</Text>
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tips[currentTipIndex].title}</Text>
                <ScrollView style={styles.tipDescriptionContainer}>
                  <Text style={styles.tipDescription}>
                    {tips[currentTipIndex].description}
                  </Text>
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity onPress={nextTip} style={styles.tipNavButton}>
              <Text style={styles.tipNavText}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Pagination Dots */}
          <View style={styles.paginationDots}>
            {tips.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentTipIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9C3',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  menuIcon: {
    fontSize: 24,
    color: 'gray',
  },
  temperature: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  plantContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  windowFrame: {
    width: 120,
    height: 160,
    backgroundColor: '#B3DEF6',
    borderWidth: 4,
    borderColor: '#8B4513',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  windowGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  windowPane: {
    width: '50%',
    height: '50%',
    backgroundColor: '#87CEFA',
    margin: 0.5,
    borderRadius: 2,
  },
  plantWrapper: {
    alignItems: 'center',
    marginBottom: -10,
  },
  pot: {
    width: 60,
    height: 40,
    backgroundColor: '#8B4513',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
  },
  plant: {
    width: 50,
    height: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    marginTop: -40,
    position: 'relative',
  },
  leaf: {
    position: 'absolute',
    width: 30,
    height: 24,
    backgroundColor: '#3E8948',
    borderRadius: 25,
  },
  leafLeft: {
    bottom: 15,
    left: -12,
    transform: [{ rotate: '-45deg' }],
  },
  leafRight: {
    bottom: 20,
    right: -12,
    transform: [{ rotate: '45deg' }],
  },
  leafTop: {
    top: -5,
    left: 10,
    transform: [{ rotate: '0deg' }],
  },
  plantInfo: {
    alignItems: 'center',
  },
  plantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    padding: 16,
    borderRadius: 12,
    flex: 0.45,
  },
  scheduleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tipsContainer: {
    flex: 1,
  },
  tipCard: {
    backgroundColor: '#E7FAE7',
    borderRadius: 16,
    padding: 16,
    flex: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tipNavButton: {
    padding: 8,
  },
  tipNavText: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tipContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  tipDescriptionContainer: {
    maxHeight: 80,
  },
  tipDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d0d0d0',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
});