import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  FlatList 
} from 'react-native';

interface AgePickerProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

const ageOptions = [
  '0 weeks', '1 week', '2 weeks', '3 weeks', '1 month',
  '2 months', '3 months', '6 months', '1 year', '2+ years'
];

export default function AgePicker({ selectedAge, onAgeSelect }: AgePickerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (age: string) => {
    onAgeSelect(age);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.dropdownText}>{selectedAge}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Plant Age</Text>
            <FlatList
              data={ageOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.ageOption}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.ageOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  ageOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ageOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});