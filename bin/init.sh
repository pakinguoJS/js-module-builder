#!/bin/bash

chmod 755 jsmb jsmb-watch-start.sh jsmb-watch-stop.sh jsmb-restart.sh

ln -s /home/pakinguo/jsmb/bin/jsmb /usr/local/bin/jsmb
ln -s /home/pakinguo/jsmb/bin/jsmb-restart.sh /usr/local/bin/jsmb-start
ln -s /home/pakinguo/jsmb/bin/jsmb-watch-stop.sh /usr/local/bin/jsmb-stop
ln -s /home/pakinguo/jsmb/bin/jsmb-restart.sh /usr/local/bin/jsmb-restart
