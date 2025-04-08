import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';
import MQTTService from '../services/mqttService';

export default function MonitoringScreen() {
  const [errorData, setErrorData] = useState<{ x: number; y: number }[]>([]);
  const [controlData, setControlData] = useState<{ x: number; y: number }[]>([]);
  const [setpointData, setSetpointData] = useState<{ x: number; y: number }[]>([]);
  const [readingData, setReadingData] = useState<{ x: number; y: number }[]>([]);
  const [running, setRunning] = useState(false);

  const toggleSystem = () => {
    setRunning((prev) => {
      const message = prev ? '0' : '1';
      MQTTService.publish('control/status', message);

      if (prev) {
        setErrorData([]);
        setControlData([]);
        setSetpointData([]);
        setReadingData([]);
      }
  
      return !prev;
    });
  };

  useEffect(() => {
    const handleMessage = (message: any) => {
      try {
        const [time, error, control, setpoint, reading] = message.payloadString.split(', ').map(Number);

        // Update error and control data
        setErrorData((prev) => [...prev, { x: time, y: error }]);
        setControlData((prev) => [...prev, { x: time, y: control }]);
        setSetpointData((prev) => [...prev, { x: time, y: setpoint }]);
        setReadingData((prev) => [...prev, { x: time, y: reading }]);
      } catch (e) {
        console.error('Error processing MQTT message:', e);
      }
    };

    const handleConnectionLost = (response: any) => {
      console.warn('Connection lost:', response.errorMessage);
    };

    if (MQTTService.client != null)
    {
      MQTTService.subscribe('esp/return');
      MQTTService.client.onMessageArrived = handleMessage;
      MQTTService.client.onConnectionLost = handleConnectionLost;
    }

    return () => {
      if (MQTTService.client != null)
      {
        MQTTService.client.onMessageArrived = () => {};
      }
    };
  });

  return (
    <View style={styles.container}>
      {/* Error and Control Graph */}
      <VictoryChart
        width={Dimensions.get('window').width - 32}
        height={250}
        padding={{ top: 50, bottom: 50, left: 50, right: 50 }}>
        <VictoryAxis label="Time (s)" tickFormat={(t) => Number(t)} tickCount={4} />
        <VictoryAxis dependentAxis />
        <VictoryLine data={errorData} style={{ data: { stroke: '#FF3B30' } }} />
        <VictoryLine data={controlData} style={{ data: { stroke: '#007AFF' } }} />
        <VictoryLegend
          x={50}
          y={0}
          orientation="vertical"
          data={[
            { name: 'Error', symbol: { fill: '#FF3B30' } },
            { name: 'Control', symbol: { fill: '#007AFF' } },
          ]}
        />
      </VictoryChart>
  
      {/* Setpoint and Reading Graph */}
      <VictoryChart
        width={Dimensions.get('window').width - 32}
        height={250}
        padding={{ top: 50, bottom: 50, left: 50, right: 50 }}>
        <VictoryAxis label="Time (s)" tickFormat={(t) => Number(t)} tickCount={4} />
        <VictoryAxis dependentAxis />
        <VictoryLine data={setpointData} style={{ data: { stroke: '#34C759' } }} />
        <VictoryLine data={readingData} style={{ data: { stroke: '#FF9500' } }} />
        <VictoryLegend
          x={50}
          y={0}
          orientation="vertical"
          data={[
            { name: 'Setpoint', symbol: { fill: '#34C759' } },
            { name: 'Reading', symbol: { fill: '#FF9500' } },
          ]}
        />
      </VictoryChart>
      
      <TouchableOpacity
        onPress={toggleSystem}
        style={{
          backgroundColor: running ? 'red' : 'green',
          padding: 12,
          borderRadius: 40,
          alignItems: 'center',
          marginTop: 16,
        }}>
        <Text style={{ color: 'white', fontSize: 16 }}>
          {running ? 'Stop System' : 'Start System'}
        </Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  slider: {
    height: 40,
  },
});