#!/bin/bash

palserver_dir=$1

# Check if palworld screen is running
if screen -list | grep -q "palworld"; then
    echo "Palworld screen is running. Please shutdown the server."
else
    # If not running, start PalServer.sh
    echo "Palworld screen is not running. Initiating Update"
    # Execute Update for APP
    steamcmd force_install_dir $palserver_dir +login anonymous +app_update 2394010 validate +quit
fi
