import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeTab() {
  const router = useRouter();

  const handleBeginOnboarding = () => {
    router.push('/plant-setup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Plant Pal</Text>
      </View>

      {/* Plant Illustration */}
      <View style={styles.plantContainer}>
        <Text style={styles.plantIcon}>🪴</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Help you plants grow and thrive!</Text>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <Text style={styles.featureTitle}>Keep care</Text>
          <Text style={styles.featureSubtitle}>schedule on</Text>
          <Text style={styles.featureSubtitle}>track</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.iconText}>🔔</Text>
          </View>
          <Text style={styles.featureTitle}>Be notified</Text>
          <Text style={styles.featureSubtitle}>of watering</Text>
          <Text style={styles.featureSubtitle}>times</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.iconText}>🌳</Text>
          </View>
          <Text style={styles.featureTitle}>Learn more</Text>
          <Text style={styles.featureSubtitle}>about your</Text>
          <Text style={styles.featureSubtitle}>plant</Text>
        </View>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Begin Onboarding Button */}
        <TouchableOpacity 
          style={styles.onboardingButton}
          onPress={handleBeginOnboarding}
        >
          <Text style={styles.buttonText}>Begin Onboarding</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  plantContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantIcon: {
    fontSize: 120,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 100,
  },
  featureIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#60A5FA',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onboardingButton: {
    backgroundColor: '#A5D6A7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  buttonArrow: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
});