import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ children, style, onPress }) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      style={[styles.container, style]} 
      onPress={onPress}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF08A', // Direct color value
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Card;