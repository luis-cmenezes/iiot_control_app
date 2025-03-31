import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';

const WINDOW_SIZE = 50;

export default function MonitoringScreen() {
  const [errorData, setErrorData] = useState<{ x: number, y: number }[]>([]);
  const [controlData, setControlData] = useState<{ x: number, y: number }[]>([]);
  const [counter, setCounter] = useState(0);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const time = counter;
      const error = 1;
      const control = 2;

      setErrorData(prev => {
        const newData = [...prev, { x: time, y: error }];
        return newData.length > WINDOW_SIZE ? newData.slice(-WINDOW_SIZE) : newData;
      });

      setControlData(prev => {
        const newData = [...prev, { x: time, y: control }];
        return newData.length > WINDOW_SIZE ? newData.slice(-WINDOW_SIZE) : newData;
      });

      setCounter(prev => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [counter]);

  const lineProps = Platform.select({
    web: {},
    default: { accessibilityHint: 'Graph line showing data over time' }
  });

  return (
    <View style={styles.container}>
      <VictoryChart
        width={Dimensions.get('window').width - 32}
        height={300}
        padding={{ top: 50, bottom: 50, left: 50, right: 50 }}>
        <VictoryAxis
          label="Time"
          style={{
            axis: { stroke: '#333' },
            tickLabels: { fontSize: 10 },
            grid: { stroke: '#ccc' },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Value"
          style={{
            axis: { stroke: '#333' },
            tickLabels: { fontSize: 10 },
            grid: { stroke: '#ccc' },
          }}
        />
        <VictoryLine
          data={errorData}
          style={{ data: { stroke: '#FF3B30' } }}
          {...lineProps}
        />
        <VictoryLine
          data={controlData}
          style={{ data: { stroke: '#007AFF' } }}
          {...lineProps}
        />
        <VictoryLegend
          x={50}
          y={0}
          orientation="horizontal"
          data={[
            { name: 'Error', symbol: { fill: '#FF3B30' } },
            { name: 'Control', symbol: { fill: '#007AFF' } },
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
});