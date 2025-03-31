import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ControlScreen() {
  const [gains, setGains] = useState({
    kp: '',
    ki: '',
    kd: '',
  });
  
  const [poles, setPoles] = useState(['']);
  const [zeros, setZeros] = useState(['']);
  const [setpoint, setSetpoint] = useState('');

  const addPole = () => setPoles([...poles, '']);
  const addZero = () => setZeros([...zeros, '']);

  const removePole = (index: number) => {
    const newPoles = poles.filter((_, i) => i !== index);
    setPoles(newPoles);
  };

  const removeZero = (index: number) => {
    const newZeros = zeros.filter((_, i) => i !== index);
    setZeros(newZeros);
  };

  const updatePole = (value: string, index: number) => {
    const newPoles = [...poles];
    newPoles[index] = value;
    setPoles(newPoles);
  };

  const updateZero = (value: string, index: number) => {
    const newZeros = [...zeros];
    newZeros[index] = value;
    setZeros(newZeros);
  };

  const handleSubmit = () => {
    const controlData = {
      gains,
      poles: poles.filter(p => p !== '').map(Number),
      zeros: zeros.filter(z => z !== '').map(Number),
      setpoint: Number(setpoint),
    };
    console.log('Control Parameters:', controlData);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PID Gains</Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Kp:</Text>
          <TextInput
            style={styles.input}
            value={gains.kp}
            onChangeText={(value) => setGains({ ...gains, kp: value })}
            keyboardType="numeric"
            placeholder="Proportional gain"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Ki:</Text>
          <TextInput
            style={styles.input}
            value={gains.ki}
            onChangeText={(value) => setGains({ ...gains, ki: value })}
            keyboardType="numeric"
            placeholder="Integral gain"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Kd:</Text>
          <TextInput
            style={styles.input}
            value={gains.kd}
            onChangeText={(value) => setGains({ ...gains, kd: value })}
            keyboardType="numeric"
            placeholder="Derivative gain"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Poles</Text>
        {poles.map((pole, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={pole}
              onChangeText={(value) => updatePole(value, index)}
              keyboardType="numeric"
              placeholder={`Pole ${index + 1}`}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePole(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addPole}>
          <Text style={styles.addButtonText}>Add Pole</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Zeros</Text>
        {zeros.map((zero, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={zero}
              onChangeText={(value) => updateZero(value, index)}
              keyboardType="numeric"
              placeholder={`Zero ${index + 1}`}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeZero(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addZero}>
          <Text style={styles.addButtonText}>Add Zero</Text>
        </TouchableOpacity>
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