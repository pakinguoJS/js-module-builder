module.exports = jsduck;


/**
 * 执行jsduck编译命令
 * 当参数为空时，默认设定源文件夹为当前路径，目标路径为与当前路径同级的文件夹名-dist
 * 当只有一个参数时，默认该参数为目标路径
 * @param {String} src 源路径
 * @param {String} dst 目标路径
 */
function jsduck(src, dst) {
    var cmd = 'jsduck {src} --output {dst}';

    if(src && dst){
        cmd = cmd.replace('{src}', src).replace('{dst}', dst);
    }else if(src){
        cmd = cmd.replace('{src}', process.cwd().replace(/\\/g, '/')).replace('{dst}', src);
    }else{
        var cwd = process.cwd().replace(/\\/g, '/');
        cmd = cmd.replace('{src}', cwd).replace('{dst}', cwd + '-jsduck-dist');
    }

    require('child_process').exec(cmd, function (err, stdout, stderr) {
        if (err !== null) {
            console.log(err);
        } else {
            console.log(stdout);
        }
    });
}