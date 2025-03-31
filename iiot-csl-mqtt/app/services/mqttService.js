import Paho from 'paho-mqtt';

class MQTTService {
    constructor() {
        this.client = null;
    }

    connect(brokerUrl, port, clientId, onMessageArrived, onConnectionLost) {
        return new Promise((resolve, reject) => {
            this.client = new Paho.Client(brokerUrl, port, clientId || `expo-client-${Math.random()}`);

            this.client.onMessageArrived = onMessageArrived;
            this.client.onConnectionLost = onConnectionLost;

            this.client.connect({
                onSuccess: () => {
                    console.log('✅ Conectado ao broker MQTT');
                    resolve();
                },
                onFailure: (error) => {
                    console.log('❌ Falha na conexão:', error);
                    reject(error);
                },
            });
        });
    }

    subscribe(topic) {
        if (this.client && this.client.isConnected()) {
            this.client.subscribe(topic);
            console.log(`📡 Inscrito no tópico: ${topic}`);
        }
    }

    publish(topic, message) {
        if (this.client && this.client.isConnected()) {
            const mqttMessage = new Paho.Message(message);
            mqttMessage.destinationName = topic;
            this.client.send(mqttMessage);
            console.log(`📤 Mensagem enviada para ${topic}: ${message}`);
        }
    }

    disconnect() {
        if (this.client) {
            this.client.disconnect();
            console.log('🔌 Desconectado do MQTT');
        }
    }
}

export default new MQTTService();
