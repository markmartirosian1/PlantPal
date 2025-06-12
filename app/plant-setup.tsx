import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function PlantSetupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plantName, setPlantName] = useState('');
  const [plantImage, setPlantImage] = useState(null);
  const [showValidation, setShowValidation] = useState(false);

  const handleCreateAccount = () => {
    // Check if required fields are filled
    if (!username.trim() || !email.trim() || !password.trim() || !plantName.trim()) {
      setShowValidation(true);
      return;
    }

    // Here you would typically create the account and save the plant data
    Alert.alert(
      'Account Created!',
      `Welcome ${username}! Your plant "${plantName}" has been added to your garden.`,
      [
        {
          text: 'Get Started',
          onPress: () => router.replace('/dashboard')
        }
      ]
    );
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPlantImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPlantImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Plant Photo',
      'Choose how you\'d like to add a photo of your plant',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const clearValidation = (field, value) => {
    if (showValidation && value.trim()) {
      setShowValidation(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Join Plant Pal and add your first plant!</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Username */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Username</Text>
          <TextInput
            style={[
              styles.textInput,
              showValidation && !username.trim() && styles.inputError
            ]}
            placeholder="Choose a username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              clearValidation('username', text);
            }}
            autoCapitalize="none"
          />
          {showValidation && !username.trim() && (
            <Text style={styles.errorText}>Username is required</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={[
              styles.textInput,
              showValidation && !email.trim() && styles.inputError
            ]}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearValidation('email', text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {showValidation && !email.trim() && (
            <Text style={styles.errorText}>Email is required</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={[
              styles.textInput,
              showValidation && !password.trim() && styles.inputError
            ]}
            placeholder="Create a password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearValidation('password', text);
            }}
            secureTextEntry
          />
          {showValidation && !password.trim() && (
            <Text style={styles.errorText}>Password is required</Text>
          )}
        </View>

        {/* Plant Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Give Your Plant a Name</Text>
          <TextInput
            style={[
              styles.textInput,
              showValidation && !plantName.trim() && styles.inputError
            ]}
            placeholder="e.g., Sunny, Green Friend, Oscar..."
            placeholderTextColor="#999"
            value={plantName}
            onChangeText={(text) => {
              setPlantName(text);
              clearValidation('plantName', text);
            }}
          />
          {showValidation && !plantName.trim() && (
            <Text style={styles.errorText}>Plant name is required</Text>
          )}
        </View>

        {/* Plant Photo */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Add a Photo of Your Plant</Text>
          <TouchableOpacity 
            style={styles.photoContainer}
            onPress={showImageOptions}
          >
            {plantImage ? (
              <Image source={{ uri: plantImage }} style={styles.plantImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={styles.photoText}>Tap to add photo</Text>
                <Text style={styles.photoSubtext}>(Optional)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Account Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.buttonText}>Create Account & Add Plant</Text>
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
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
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
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  photoText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  photoSubtext: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  plantImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});