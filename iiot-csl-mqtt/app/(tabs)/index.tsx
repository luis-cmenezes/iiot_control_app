import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MQTTService from '../services/mqttService';

export default function ControlScreen() {
  const [controller, setController] = useState({
    pole: '',
    zero: '',
    gain: '',
  });
  
  const [setpoint, setSetpoint] = useState('');

  const handleSubmit = () => {
    const message = `${controller.zero}, ${controller.pole}, ${controller.gain}, ${Number(setpoint)}`;

    MQTTService.publish('control/parameters', message);
    console.log('Control Parameters Published:', message);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequency Response Controller</Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Gain:</Text>
          <TextInput
            style={styles.input}
            value={controller.gain}
            onChangeText={(value) => setController({ ...controller, gain: value })}
            keyboardType="numeric"
            placeholder="Controller gain"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Pole:</Text>
          <TextInput
            style={styles.input}
            value={controller.pole}
            onChangeText={(value) => setController({ ...controller, pole: value })}
            keyboardType="numeric"
            placeholder="Compensator pole"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Zero:</Text>
          <TextInput
            style={styles.input}
            value={controller.zero}
            onChangeText={(value) => setController({ ...controller, zero: value })}
            keyboardType="numeric"
            placeholder="Compensator zero"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Setpoint</Text>
        <TextInput
          style={styles.input}
          value={setpoint}
          onChangeText={setSetpoint}
          keyboardType="numeric"
          placeholder="Enter setpoint value"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Apply Parameters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 40,
    fontSize: 16,
    color: '#666',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});