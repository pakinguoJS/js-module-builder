#!/bin/bash
cat _jsmb_/pid.log | while read Line
do
    kill -9 $Line
done
nohup jsmb watch > _jsmb_/nohup.log 2>&1 & echo $! > _jsmb_/pid.log
PWD=$(pwd);
echo [OK] ... Realtime monitor of \"$PWD\" is running now!
