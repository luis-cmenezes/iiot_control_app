//Incluindo biblioteca para leitura do encoder
#include <Encoder.h>

//Definindo objeto meuEncoder
Encoder meuEncoder(2, 3);

//Definindo outras variaveis uteis
double thetak = 0.0, thetakm1 = 0.0;
double tempo1 = 0.0, tempo2 = 0.0, dt = 0.0, omega_ref = 0;
double velk, vel1 = 0.0, vel2 = 0.0, vel3 = 0.0, mediavel;
double uk = 0.0, ukm1 = 0.0, errokm1 = 0.0, errok = 0.0;
double erro_deriv, f;
long contEnc = 0.0;

//Zero e Polo compensador
float a = 0, b = 0;

void setup() {
  //Inicializando comunicacao serial  
  Serial.begin(115200);
  
   //Definindo Entradas da ponte H
  pinMode(5,OUTPUT); pinMode(7,OUTPUT); pinMode(8,OUTPUT); 

  //sentido horario
  digitalWrite(7,HIGH); digitalWrite(8,LOW);
 }

void loop() {
  tempo1 = tempo2;
  //Determinando leitura autal do encoder
  contEnc = meuEncoder.read();
  
  //Calculando theta a partir da leitura do encoder
  thetak = contEnc*2*3.1415/(334*4); //rad/s
  
  //Determinando tempo atual
  tempo2 = micros();
  
  //Calculando dt
  dt = tempo2 - tempo1;//em micro s
  
  //Calculando velocidade angular
  velk = (thetak - thetakm1)/(dt/1E6);

  //calculando media movel dos tres ultimos valores
  vel3 = vel2; vel2  = vel1;  vel1 = velk;
  mediavel = (vel1 + vel2 + vel3)/3;

    //Degrau de referencia e aplicado entre 5 e 6s
  if(tempo2/1E6 >= 3 ){ 
    omega_ref = XXXX; //rad/s
  }

  //Obtendo erro de rastreamento
  errok = omega_ref - mediavel;
  
  erro_deriv = (errok - errokm1)/(dt/1E6);

  //Calculando controle
  f = XXXX;
  uk = XXXX;

  //Housekeeping
  ukm1 = uk;
  errokm1 = errok;
  thetakm1 = thetak;
  
  //Saturando na faixa linear
  uk = min(uk,100); uk = max(uk,0);
    
  //Aplicando controle a planta
  analogWrite(5,uk*255.0/100.0);
       
  //Imprimindo na porta serial
  Serial.print(mediavel);
  Serial.print(" ");
  Serial.print(uk);
  Serial.print(" ");
  Serial.println(tempo2/1E6);
  
  //Esperando proximo instante de amostragem 1ms
  while ((micros() - tempo1) < 1000.0){ }
} 
