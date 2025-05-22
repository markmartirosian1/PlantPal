import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.text}>
          This is the explore screen where you can discover new plants and care tips.
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Plants</Text>
          <Text style={styles.sectionText}>
            Discover plants that are perfect for your home environment.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Guides</Text>
          <Text style={styles.sectionText}>
            Learn how to properly care for your plants with our detailed guides.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Community</Text>
          <Text style={styles.sectionText}>
            Connect with other plant enthusiasts and share your experiences.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9C3',
  },
  content: {
    padding: 20,
    paddingTop: 60, // Account for status bar
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#FEF08A',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});