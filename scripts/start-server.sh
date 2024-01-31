#!/bin/bash

# Check if palworld screen is running
if screen -list | grep -q "palworld"; then
    echo "PalServer is already running, please stop it first."
else
    screen -dmS palworld su steam -c $1/PalServer.sh
    echo "PalServer started"
fi