// screens/HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Card from '../components/ui/Card';
import Colors from '../constants/Colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Temperature Display */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.temperature}>75° F</Text>
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
      </View>
      
      {/* Care Options */}
      <View style={styles.careOptions}>
        <Card style={styles.careCard} onPress={() => console.log('Water plant')}>
          <View style={styles.careHeader}>
            <View style={styles.careIconTitle}>
              <Text style={styles.waterDropIcon}>💧</Text>
              <Text style={styles.careTitle}>Water Plant</Text>
            </View>
            <Text style={styles.scheduleText}>every 3 days</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: '66%', backgroundColor: Colors.secondary }]}></View>
            </View>
            <Text style={styles.remainingText}>2d</Text>
          </View>
        </Card>
        
        <Card style={styles.careCard} onPress={() => console.log('Fertilize')}>
          <View style={styles.careHeader}>
            <View style={styles.careIconTitle}>
              <Text style={styles.fertilizerIcon}>🌱</Text>
              <Text style={styles.careTitle}>Fertilize</Text>
            </View>
            <Text style={styles.scheduleText}>every 30 days</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: '25%', backgroundColor: Colors.primary }]}></View>
            </View>
            <Text style={styles.remainingText}>22d</Text>
          </View>
        </Card>
        
        <Card style={[styles.careCard, { backgroundColor: '#E7FAE7' }]}>
          <View style={styles.tipHeader}>
            <View style={styles.tipIcon}>
              <Text style={styles.tipIconText}>🌿</Text>
            </View>
            <View>
              <Text style={styles.tipTitle}>Water Plant More</Text>
              <Text style={styles.tipText}>
                This kind of plant loves water! They're from the Amazon where it rains year-round every day. Make sure to give this plant plenty of water every day to make it feel at home.
              </Text>
            </View>
          </View>
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.activeDot]}></View>
            <View style={styles.dot}></View>
            <View style={styles.dot}></View>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  menuIcon: {
    fontSize: 24,
    color: 'gray',
  },
  temperature: {
    fontSize: 16,
    fontWeight: '500',
  },
  plantContainer: {
    alignItems: 'center',
    marginVertical: 24,
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
    backgroundColor: Colors.primary,
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
  careOptions: {
    flex: 1,
  },
  careCard: {
    marginBottom: 16,
  },
  careHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  careIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterDropIcon: {
    fontSize: 18,
    marginRight: 8,
    color: Colors.secondary,
  },
  fertilizerIcon: {
    fontSize: 18,
    marginRight: 8,
    color: Colors.primary,
  },
  careTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  scheduleText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  remainingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tipHeader: {
    flexDirection: 'row',
  },
  tipIcon: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tipIconText: {
    fontSize: 18,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0d0d0',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
});