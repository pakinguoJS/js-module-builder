var FS = require('fs');
var PATH = require('path');
var CHILDPROCESS = require('child_process');

/**
 *
 * @param {String} src  监听源路径
 * @param {String} configPath  jsmb的配置文件
 *
 * 备注：由于nodejs中运行linux命令时，无法将对象正常传参，故只能传配置文件的源路径，然后在rt-sync里面处理
 */
function exec(src, configPath, ignore) {
    // 确保剔除同步的文件
    ignore = '_jsmb_';

    var cmd = 'inotifywait -mre modify,create,delete,move ' + src + ' --exclude ' + ignore +
        ' | while read DIR EVENT FILE\ndo\nnode ' + PATH.join(__dirname, 'inotifywait-rt-sync.js') +
        ' "' + configPath + '" $DIR $FILE $EVENT\ndone &\necho ' + src + ' > ' + PATH.join(src, '_jsmb_/pid_inotifywait.log')

    var rs = CHILDPROCESS.exec(cmd, function (err, stdout, stderr) {
        if (err !== null) {
            console.log('inotifywait error: ' + err);
        }
    });

    console.log('Inotifywait of ' + src + ' was started!\nPlease press ctrl+c to quit the cmd!');
}

module.exports = exec;