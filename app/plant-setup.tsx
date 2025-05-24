import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import AgePicker from '../components/ui/AgePicker'; // Import the AgePicker

export default function PlantSetupScreen() {
  const router = useRouter();
  const [plantType, setPlantType] = useState('');
  const [plantName, setPlantName] = useState('');
  const [plantAge, setPlantAge] = useState('0 weeks');
  const [showValidation, setShowValidation] = useState(false);

  const handleDone = () => {
    // Check if required fields are filled
    if (!plantType.trim() || !plantName.trim()) {
      setShowValidation(true);
      return;
    }

    // Here you would typically save the plant data
    // For now, we'll just show a success message and navigate back
    Alert.alert(
      'Plant Added!',
      `${plantName} (${plantType}) has been added to your garden.`,
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleAgeSelect = (age: string) => {
    setPlantAge(age);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Plant Pal!</Text>
        <Text style={styles.subtitle}>Tell us about your plant!</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Plant Type */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Plant Type</Text>
          <TextInput
            style={[
              styles.textInput,
              showValidation && !plantType.trim() && styles.inputError
            ]}
            placeholder="Type here..."
            placeholderTextColor="#999"
            value={plantType}
            onChangeText={(text) => {
              setPlantType(text);
              if (showValidation && text.trim()) {
                setShowValidation(false);
              }
            }}
          />
          {showValidation && !plantType.trim() && (
            <Text style={styles.errorText}>Plant type is required</Text>
          )}
        </View>

        {/* Plant Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Plant Name</Text>
          <TextInput
            style={[
              styles.textInput,
              showValidation && !plantName.trim() && styles.inputError
            ]}
            placeholder="Type here..."
            placeholderTextColor="#999"
            value={plantName}
            onChangeText={(text) => {
              setPlantName(text);
              if (showValidation && text.trim()) {
                setShowValidation(false);
              }
            }}
          />
          {showValidation && !plantName.trim() && (
            <Text style={styles.errorText}>Plant name is required</Text>
          )}
        </View>

        {/* Plant Age - Updated to use AgePicker */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Plant Age</Text>
          <AgePicker 
            selectedAge={plantAge}
            onAgeSelect={handleAgeSelect}
          />
        </View>
      </View>

      {/* Done Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={handleDone}
        >
          <Text style={styles.buttonText}>Done!</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  fieldContainer: {
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: '#A5D6A7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
});