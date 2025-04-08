#!/bin/bash

BROKER="35.215.219.189"
PORT=1883
TOPIC="esp/return"

i=0
while true; do
    TEMPO=$(date +%s)
    ERROR=$((2*i))
    CONTROL=$i
    SETPOINT=$((2*i))
    READING=$i

    i=$((i + 1))
    PAYLOAD="$TEMPO, $ERROR, $CONTROL, $SETPOINT, $READING"
    mosquitto_pub -h "$BROKER" -p "$PORT" -t "$TOPIC" -m "$PAYLOAD"

    echo "Publicado: $PAYLOAD"
    sleep 0.3
done
