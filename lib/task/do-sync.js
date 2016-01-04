var fs = require('fs');
var path = require('path');
var sync = require('jsmb-sync').dsync;
var log = console.log;
var colors = require('colors');


module.exports = run;


/**
 * 实时监听同步文件
 *
 * @param {String} src  监听源路径
 * @param {String} resDest  同步的静态资源目标路径
 * @param {String} viewDest 同步的view页面目标路径
 * @param {RegExp} ignore 不需要同步文件的正则表达式
 * @param {RegExp} pattern  判断是静态资源还是view页面的正则
 * @param {RegExp} viewPattern  pattern的子集，根据需要可以不用同步没有页面的文件夹
 * @param {Boolean} viewFlat  是否扁平话文件夹
 */
function run(file, src, resDest, viewDest, recordPath, ignore,  pattern, viewPattern, viewFlat) {
    // 确保路径是以 / 分割
    src = src.replace(/\\/g, '/');
    var resCwd = resDest.replace(/\\/g, '/');
    var viewCwd = viewDest.replace(/\\/g, '/');

    // 确保记录文件最后修改时间的路径存在
    recordPath ? null : recordPath = path.join(process.cwd(), '_jsmb_/rsync.time');
    var recode = fs.existsSync(recordPath) ? JSON.parse(fs.readFileSync(recordPath, 'utf8')) : {};

    // 确保剔除同步的文件
    ignore ? null : ignore = /_jsmb_|\.tmp$/;

    // 确保view层的pattern格式
    pattern ? null : pattern = /view(\/|\\).+\.tpl$|(\/|\\)view$/;
    viewPattern ? null : viewPattern = /(\/|\\)view$/;
    viewFlat === false ? null : viewFlat = true;

    doSync(file);

    /**
     * 根据不同文件类型执行同步，主要细节在于处理完整的目标路径
     *
     * @param {String} filename 监听到变动的文件相对路径（相对于监听的路径）
     */
    function doSync(filename) {
        // 排除最后修改时间一致的文件
        var srcFile = path.join(src, filename).replace(/\\/g, '/');
        var mtime = fs.statSync(srcFile).mtime.getTime();
        if(mtime === recode[srcFile]){
            return;
        }

        // 记录最后修改时间
        recode[srcFile] = mtime;
        fs.writeFileSync(recordPath, JSON.stringify(recode), 'utf8');  // 未校验文件夹是否存在，TODO


        // 如果是view层，即.tpl后缀的文件，若viewFlat为true，只保留两层目录结构
        if (pattern.test(filename)) {
            if (!viewPattern.test(filename)) {
                if(viewFlat){
                    var dirs = filename.split(path.sep);
                    var l = dirs.length;

                    // 例如：源文件 src/demo/view/index.tpl，同步后变为 demo/index.tpl
                    sync(srcFile, path.join(viewCwd, dirs[l - 3], dirs[l - 1]));
                }else{
                    sync(srcFile, path.join(viewCwd, filename));
                }
            }
        } else {
            // 其他类型的文件直接同步
            sync(srcFile, path.join(resCwd, filename).replace(/\\/g, "/"));
        }
    }

}

