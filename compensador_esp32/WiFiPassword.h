/** DEFINITION OF WiFi DATA
 * Definition of macros SSID, username and password
*/
#define SSID "UFU-Institucional"
#define username "jorgehsm@ufu.br"
#define password "Saojorge2002"
#define anonymous "anonymous@ufu.br"

//#define SSID "Ap 201"
//#define password "cidinjorge"

#define MQTTClientid "ESP32-RECORDER"
#define MQTTServer "35.215.253.43"
#define MQTTPort 1883

/* DECLARATION OF TOPICS VARIABLES */
const char* topic_sub_status = "control/status";
const char* topic_sub_params = "control/parameters";
const char* topic_pub = "esp/return";
