# iiot_control_app

Repositório referente ao projeto final da disciplina Internet das Coisas Industrial da UFU.

O projeto consiste em um aplicativo em React Native que se comunica via MQTT com um ESP32, responsável pelo controle de velocidade de um motor DC em malha fechada.

O objetivo é permitir que a aula de laboratório sobre resposta em frequência possa ser realizada remotamente.

A interface do app é dividida em três abas:

## 1. Parâmetros de Controle

Nesta aba, o usuário insere os parâmetros do controlador:

- Ganho (K)

- Plo (b)

- Zero (a)

 - Setpoint desejado

Esses parâmetros definem a função de controle no formato:

    C(s) = K * (s + a) / (s + b) 

Ao clicar em "Apply Parameters", os dados são enviados via MQTT no tópico control/parameters para o ESP32.

<p align="center">
  <img src="https://github.com/user-attachments/assets/119997d2-f051-42a0-b255-ecae188bb06d" width="400"/>
</p>

## 2. Monitoramento do Sistema

Aqui o usuário visualiza, em tempo real, dois gráficos com as seguintes variáveis:

    Erro/Ação de controle x Tempo

    Setpoint/Velocidade do motor x Tempo

Esses dados são enviados pelo ESP32 no tópico esp/return, e o aplicativo está subscrito para receber essas informações.

Além disso, é possível iniciar ou parar o sistema usando o botão Start/Stop System. Esse comando é enviado via MQTT no tópico control/status:

 - Start: o sistema entra em operação mantendo o setpoint.

 - Stop: o sistema entra em standby com o motor desligado.

<p align="center">
  <img src="https://github.com/user-attachments/assets/e2b7c1a2-1507-4568-a8cb-161b6ef2bc39" width="400"/>
</p>

## 3. Configuração do Broker

Nesta aba, o usuário define as informações de IP e porta do broker MQTT para estabelecer a conexão.

<p align="center">
  <img src="https://github.com/user-attachments/assets/bdb5064d-0a1c-4b4c-9d1a-8e0f194a593b" width="400"/>
</p>

