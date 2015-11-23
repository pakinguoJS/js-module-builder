var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var sync = require('jsmb-sync').dsync;
var log = console.log;


module.exports = run;


/**
 * 实时监听同步文件
 *
 * @param {String} src  监听源路径
 * @param {String} resDest  同步的静态资源目标路径
 * @param {String} viewDest 同步的view页面目标路径
 * @param {RegExp} pattern  判断是静态资源还是view页面的正则
 * @param {RegExp} viewPattern  pattern的子集，根据需要可以不用同步没有页面的文件夹
 */
function run(src, resDest, viewDest, pattern, viewPattern) {
    // 确保路径是以 / 分割
    src = src.replace(/\\/g, '/');
    var resCwd = resDest.replace(/\\/g, '/');
    var viewCwd = viewDest.replace(/\\/g, '/');

    // 确保view层的pattern格式
    pattern ? null : pattern = /view(\/|\\).+\.tpl$|(\/|\\)view$/;
    viewPattern ? null : viewPattern = /(\/|\\)view$/;


    var watcher = chokidar.watch(src, {
        persistent: true,

        ignored: false,
        ignoreInitial: false,
        followSymlinks: true,
        cwd: '.',

        usePolling: true,
        alwaysStat: false,
        depth: undefined,
        interval: 1000,

        ignorePermissionErrors: false,
        atomic: true
    });

    watcher
        .on('add', function (file) {
            doSync(file);
            //log('File', file, 'has been added');
        })
        .on('change', function (file) {
            doSync(file);
            //log('File', file, 'has been changed');
        })
        .on('unlink', function (file) {
            doSync(file);
            //log('File', file, 'has been removed');
        })
        // More events.
        .on('addDir', function (file) {
            doSync(file);
            //log('Directory', file, 'has been added');
        })
        .on('unlinkDir', function (file) {
            doSync(file);
            //log('Directory', file, 'has been removed');
        })
        .on('error', function (error) {
            doSync(file);
            //log('Error happened', error);
        })
        .on('ready', function () {
            //log('Initial scan complete. Ready for changes.');
        })
        .on('raw', function (event, file, details) {
            doSync(file);
            //log('Raw event info:', event, file, details);
        });


    /**
     * 根据不同文件类型执行同步，主要细节在于处理完整的目标路径
     *
     * @param {String} filename 监听到变动的文件相对路径（相对于监听的路径）
     */
    function doSync(filename) {
        // 如果是view层，即是.tpl后缀的文件，只保留两层目录结构
        if (pattern.test(filename)) {
            if (!viewPattern.test(filename)) {
                var dirs = filename.split(path.sep);
                var l = dirs.length;

                // 例如：源文件 app/demo/view/index.tpl，同步后变为 demo/index.tpl
                sync(path.join(src, filename).replace(/\\/g, '/'), path.join(viewCwd, dirs[l - 3], dirs[l - 1]));
            }
        } else {
            // 其他类型的文件直接同步
            sync(path.join(src, filename).replace(/\\/g, '/'), path.join(resCwd, filename).replace(/\\/g, "/"));
        }
    }

}

