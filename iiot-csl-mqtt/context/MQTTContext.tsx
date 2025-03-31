import React, { createContext, useContext, useState, useCallback } from 'react';
import * as mqtt from 'mqtt';

interface MQTTContextType {
  isConnected: boolean;
  connect: (settings: BrokerSettings) => void;
  disconnect: () => void;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string, callback: (message: string) => void) => () => void;
}

interface BrokerSettings {
  host: string;
  port: string;
  clientId: string;
}

const MQTTContext = createContext<MQTTContextType>({
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  publish: () => {},
  subscribe: () => () => {},
});

export const useMQTTContext = () => useContext(MQTTContext);

export function MQTTProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscribers, setSubscribers] = useState<{
    [topic: string]: ((message: string) => void)[];
  }>({});

  const connect = useCallback((settings: BrokerSettings) => {
    if (client) {
      client.end();
    }

    const mqttClient = mqtt.connect(`ws://${settings.host}:${settings.port}`, {
      clientId: settings.clientId,
    });

    mqttClient.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to MQTT broker');
    });

    mqttClient.on('message', (topic, message) => {
      const callbacks = subscribers[topic] || [];
      callbacks.forEach((callback) => callback(message.toString()));
    });

    mqttClient.on('error', (error) => {
      console.error('MQTT Error:', error);
      setIsConnected(false);
    });

    mqttClient.on('close', () => {
      setIsConnected(false);
      console.log('Disconnected from MQTT broker');
    });

    setClient(mqttClient);
  }, [subscribers]);

  const disconnect = useCallback(() => {
    if (client) {
      client.end();
      setClient(null);
      setIsConnected(false);
    }
  }, [client]);

  const publish = useCallback((topic: string, message: string) => {
    if (client && isConnected) {
      client.publish(topic, message);
    }
  }, [client, isConnected]);

  const subscribe = useCallback((topic: string, callback: (message: string) => void) => {
    if (client) {
      client.subscribe(topic);
      setSubscribers((prev) => ({
        ...prev,
        [topic]: [...(prev[topic] || []), callback],
      }));
    }

    return () => {
      if (client) {
        client.unsubscribe(topic);
        setSubscribers((prev) => ({
          ...prev,
          [topic]: prev[topic]?.filter((cb) => cb !== callback) || [],
        }));
      }
    };
  }, [client]);

  return (
    <MQTTContext.Provider value={{ isConnected, connect, disconnect, publish, subscribe }}>
      {children}
    </MQTTContext.Provider>
  );
}