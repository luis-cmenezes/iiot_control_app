import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import MQTTService from '../services/mqttService';

export default function SettingsScreen() {
  const [mqttIP, setMqttIP] = useState('');
  const [mqttPort, setMqttPort] = useState('');

  const connectToMQTT = () => {
    if (!mqttIP || !mqttPort) {
      Alert.alert('Error', 'Fill IP and Port');
      return;
    }

    MQTTService.connect(
      mqttIP,
      parseInt(mqttPort),
      'expo-client',
      (message: any) => console.log(`📩 Recebido: ${message.payloadString}`),
      (error: any) => console.log(`⚠️ Conexão perdida: ${error.errorMessage}`)
    ).then(() => {
      Alert.alert('Success', 'Connected to broker');
    }).catch(() => {
      Alert.alert('Error', 'Connection failed');
    });
  };


  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MQTT Settings</Text>

        <TextInput
          style={styles.input}
          placeholder="MQTT IP"
          value={mqttIP}
          onChangeText={setMqttIP}
        />

        <TextInput
          style={styles.input}
          placeholder="MQTT Port"
          value={mqttPort}
          onChangeText={setMqttPort}
          keyboardType="numeric"
        />

        <Button title="Conectar" onPress={connectToMQTT} />
      </View>
    </View>
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
});
