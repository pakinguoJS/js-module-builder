#!/bin/bash
cat _jsmb_/pid.log | while read Line
do 
    kill -9 $Line
    echo "[OK] ... Realtime monitor of \""$(pwd)"\" has been stopped!"
done
