var FS = require('fs');
var PATH = require('path');
var CHILDPROCESS = require('child_process');

module.exports = function(src){
    try{
        var ipath = PATH.join(src, '_jsmb_/pid_inotifywait.log');
        var isrc = FS.readFileSync(ipath, 'utf8').replace(/\r\n|\n/g, '');
        var cmd = "ps -ef | grep inotifywait | grep " + isrc + " | awk -- '{print $2}' > " + ipath + "\ncat " + ipath + " | while read line\ndo\nkill -9 $line\ndone\n";
        CHILDPROCESS.exec(cmd, function(err, stdout, stderr){
            if(err){
                // console.log(err);
            }else{
            }
            FS.unlinkSync(ipath);
        });

        console.log('Inotifywait of ' + isrc + ' has been stoped!');
    }catch(e){

    }
}