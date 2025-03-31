import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';
import MQTTService from '../services/mqttService';

export default function MonitoringScreen() {
  const [errorData, setErrorData] = useState<{ x: number; y: number }[]>([]);
  const [controlData, setControlData] = useState<{ x: number; y: number }[]>([]);
  const [setpointData, setSetpointData] = useState<{ x: number; y: number }[]>([]);
  const [readingData, setReadingData] = useState<{ x: number; y: number }[]>([]);

  const firstTimeRef = useRef(-1);

  useEffect(() => {
    const handleMessage = (message: any) => {
      try {
        const payload = JSON.parse(message.payloadString);
        const { time, error, control, setpoint, reading } = payload;
        if (firstTimeRef.current === -1) {
          firstTimeRef.current = time;
        }

        // Update error and control data
        setErrorData((prev) => [...prev, { x: time - firstTimeRef.current, y: error }]);
        setControlData((prev) => [...prev, { x: time - firstTimeRef.current, y: control }]);
        setSetpointData((prev) => [...prev, { x: time - firstTimeRef.current, y: setpoint }]);
        setReadingData((prev) => [...prev, { x: time - firstTimeRef.current, y: reading }]);
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