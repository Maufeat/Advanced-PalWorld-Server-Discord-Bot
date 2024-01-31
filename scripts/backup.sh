#!/bin/bash
palserver_dir=$1
palserver_backup_dir=$2

# Specify the path
save_path="$palserver_dir/Pal/Saved/"
cp -r $save_path $palserver_backup_dir/Saved-$(date +"%-m-%-d-%y-%-I-%M-%p")
echo "Backup complete"
