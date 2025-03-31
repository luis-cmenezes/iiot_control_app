/**
 * Created on Dec, 2024
 * @headerfile: PNRD recorder
 * 
 * @details: This code receive message from MQTT protocol and set the variables of
 * the PNRD/iPNRD to be stored in a tag.
 *   1- MQTT set the variables of PNRD/iPNRD
 *   2- When tag presented it erase, restore to factory and format the tag as NDEF format
 *   3- Then it stores the PNRD/iPNRD in the tag using NDEF format
 * 
 * @author: Álisson Carvalho Vasconcelos
 * @authors updater: 
 * @authors github: AlissonCV
 * 
 * @copyright: Free for All
*/

/** DEFINITION OF WiFi DATA
 * Definition of macros SSID, username and password
*/
#define SSID "UFU-Institucional"
#define username "jorgehsm@ufu.br"
#define password "Saojorge2002"
#define anonymous "anonymous@ufu.br"

/** DEFINITION OF MQTT DATA
 * Definition of macros MQTTClientid, MQTTServer and MQTTPort
*/
#define MQTTClientid "ESP32-RECORDER"
#define MQTTServer "200.19.144.16"
#define MQTTPort 1883

/* DEFINITION OF READER PORT INPUT */
#define port 1

/* DECLARATION OF TOPICS VARIABLES */
const char* topic_sub = "control_app/#";
const char* topic_pub = "control_app/#";
