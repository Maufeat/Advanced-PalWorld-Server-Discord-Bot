#!/bin/bash

if screen -list | grep -q "palworld"; then
    killall "PalServer-Linux-Test"
    killall "steamcmd"
    screen -X -S palworld quit
    echo "PalServer has shutdown."
else
    echo "PalServer is not running."
fi