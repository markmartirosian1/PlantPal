import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index" 
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FEF08A',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔍</Text>
          ),
        }}
      />
    </Tabs>
  );
}