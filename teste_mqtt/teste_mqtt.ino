#include <WiFi.h>
#include "WiFiPassword.h"
#include <PubSubClient.h>

// IP do seu computador (onde está rodando o Mosquitto)
const char* mqtt_server = MQTTServer;  // Altere para o IP correto

WiFiClient espClient;
PubSubClient client(espClient);

const int ledPin = LED_BUILTIN;  // Pino do LED embutido
bool ledState = false;           // Estado do LED

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida no tópico: ");
  Serial.println(topic);

  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("Mensagem: ");
  Serial.println(message);

  // Se a mensagem for "ON", liga o LED; se for "OFF", desliga
  if (message.equalsIgnoreCase("ON")) {
    ledState = true;
  } else if (message.equalsIgnoreCase("OFF")) {
    ledState = false;
  }

  // Atualiza o estado do LED
  digitalWrite(ledPin, ledState ? HIGH : LOW);

  // Publica o novo estado no tópico "teste/return"
  String response = ledState ? "LED ligado" : "LED desligado";
  client.publish("teste/return", response.c_str());
  Serial.println("Publicado: " + response);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando ao MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("conectado!");
      client.subscribe("teste/led");  // Inscreve-se no tópico
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void setup() {

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  Serial.begin(115200);
  // Conecta ao Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Conectado!");

  // Configura MQTT
  client.setServer(MQTTServer, MQTTPort);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
