import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { identifyPlant } from '../services/plantIdApi';
import axios from 'axios';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlantIdentification'>;
};

export default function PlantIdentificationScreen({ navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setError(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.toJSON());
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      setError('Failed to take photo');
    }
  };

  const identifyPlantImage = async () => {
    if (!image) return;

    try {
      setLoading(true);
      setError(null);
      const result = await identifyPlant(image);
      console.log('Plant.id API result:', JSON.stringify(result, null, 2));
      navigation.navigate('PlantResult', { plantData: result });
    } catch (err) {
      setError('Failed to identify plant');
      console.error('Plant.id API error:', err);
      if (axios.isAxiosError(err) && err.response) {
        console.error('API error response:', JSON.stringify(err.response.data, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No image selected</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={pickImage}
          style={styles.button}
          icon="image"
        >
          Pick from Gallery
        </Button>
        <Button
          mode="contained"
          onPress={takePhoto}
          style={styles.button}
          icon="camera"
        >
          Take Photo
        </Button>
        {image && (
          <Button
            mode="contained"
            onPress={identifyPlantImage}
            style={styles.button}
            disabled={loading}
            icon="magnify"
          >
            {loading ? 'Identifying...' : 'Identify Plant'}
          </Button>
        )}
      </View>

      {loading && <ActivityIndicator style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholder: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
  loader: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
}); 