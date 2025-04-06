#include <WiFi.h>
#include <WiFiPassword.h>
#include <PubSubClient.h>

//Incluindo biblioteca para leitura do encoder
#include <Encoder.h>

#define ENC_A 34
#define ENC_B 35
#define PWM 18
#define IN1 19
#define IN2 21

//Definindo objeto meuEncoder
Encoder meuEncoder(ENC_A, ENC_B);

//Definindo outras variaveis uteis
float thetak = 0.0, thetakm1 = 0.0;
float tempo1 = 0.0, tempo2 = 0.0, dt = 0.0;
float velk, vel1 = 0.0, vel2 = 0.0, vel3 = 0.0, mediavel = 0.0;
float uk = 0.0, ukm1 = 0.0, errokm1 = 0.0, errok = 0.0;
long contEnc = 0.0;

//Zero e Polo compensador
float a = 0, b = 0, K = 0, omega_ref = 0;

bool status = false;

//MQTT
double tempo_ini = 0.0, tempo_return = 0.0;
unsigned long lastPublish = 0;

WiFiClient espClient;
PubSubClient client(espClient);

String retorno;

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando ao MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("conectado!");
      client.subscribe(topic_sub_params);  // Inscreve-se no tópico
      client.subscribe(topic_sub_status);  // Inscreve-se no tópico
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) == topic_sub_params) {
    sscanf(message.c_str(), "%f, %f, %f, %f", &a, &b, &K, &omega_ref);
  }

  else if (String(topic) == topic_sub_status) {
    tempo_ini = micros();
    int intStatus;
    sscanf(message.c_str(), "%d", &intStatus);
    status = (intStatus == 1);
  }

  // Publica o novo estado no tópico "teste/return"
  String response = "Recebido: " + message;
  client.publish("esp/ack", response.c_str());

  Serial.print(a);
  Serial.print(" ");
  Serial.print(b);
  Serial.print(" ");
  Serial.print(K);
  Serial.print(" ");
  Serial.println(omega_ref);

  Serial.println(status);
}

void setup() {
  //Inicializando comunicacao serial
  Serial.begin(115200);

  //Definindo Entradas da ponte H
  pinMode(PWM, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  //sentido horario
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);

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

  if (micros() - tempo1 > 1000 && status) {
    //Determinando leitura autal do encoder
    contEnc = meuEncoder.read();

    //Calculando theta a partir da leitura do encoder
    thetak = contEnc * 2 * 3.1415 / (334 * 4);  //rad/s

    //Determinando tempo atual
    tempo2 = micros();

    //Calculando dt
    dt = tempo2 - tempo1;  //em micro s
    tempo1 = tempo2;

    //Calculando velocidade angular
    velk = (thetak - thetakm1) / (dt / 1E6);

    //calculando media movel dos tres ultimos valores
    vel3 = vel2;
    vel2 = vel1;
    vel1 = velk;
    mediavel = (vel1 + vel2 + vel3) / 3;

    //Obtendo erro de rastreamento
    errok = omega_ref - velk;  //mediavel;

    //Calculando controle
    uk = (ukm1 - K * errokm1 + K * a * errok) / b;

    //Housekeeping
    ukm1 = uk;
    errokm1 = errok;
    thetakm1 = thetak;

    if (uk >= 100) { uk = 100; }
    if (uk <= 0) { uk = 0; }

    //Aplicando controle a planta
    analogWrite(PWM, uk * 255.0 / 100.0);

    tempo_return = (micros() - tempo_ini) / 1E6;

    retorno = String(tempo_return, 2) + "," + String(errok, 2) + "," + String(uk, 2) + "," + String(omega_ref, 2) + "," + String(mediavel, 2);
    Serial.println(retorno);
  }

  if (millis() - lastPublish > 1000 && status) {  // publica a cada 1000 ms
    client.publish(topic_pub, retorno.c_str());
    lastPublish = millis();
  }
}
