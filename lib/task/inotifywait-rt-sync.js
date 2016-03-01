var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var sync = require('jsmb-sync').dsync;
var log = console.log;
var colors = require('colors');
var CHILDPROCESS = require('child_process');


var jsmb = {};
jsmb.config = {
    "src": "./",
    "dest": "../resource",
    "view": "../views/src",
    "ignore": /_jsmb_|\.tmp$/,
    "viewFlat": true,

    "realtimeI18n": {
        type: "xml",
            xgettextSrc: "./app/src",
            resourceSrc: "../resource/app/src",
            resourceDest: "../resource/app/{lang}",
            viewSrc: "../views/src",
            viewDest: "../views/{lang}",
            destDir: "_jsmb_/i18n",
            map: /\{lang\}/,
            langList: {
            "en": "./xml/en/all.xml"
        }
    },

    "i18n": {
        type: "xml",
            xgettextSrc: "./app/src",
            resourceSrc: "../resource/app/src",
            resourceDest: "../resource/app/{lang}",
            viewSrc: "../views/src",
            viewDest: "../views/{lang}",
            destDir: "_jsmb_/i18n",
            map: /\{lang\}/,
            langList: {
            "en": "./xml/en/all.xml"
        }
    },

    "transport": false,
        "uglifyjs": false,
        "minifycss": false,
        "version": false,
        "clean": {
        files: [
            "../resource",
            "../views",
            "_jsmb_/rsync.time"
        ]
    }
}

jsmb.util = {
    cwd: process.cwd(),
    path: function (url) {
        if (/^(\/|[A-Za-z]:|file:|http[s]{0,1}:)/.test(url)) {
            return url;
        } else {
            return path.join(jsmb.util.cwd, url).replace(/\\/g, "/");
        }
    },
    join: function (cwd, list) {
        var output = [];
        list.forEach(function (item) {
            output.push(path.join(cwd, item));
        });
        return output;
    }
}

/**
 * 设置jsmb参数
 * @param {string||object} key 配置的key或对象
 * @param {string} val 当key为string时，此值为key对应的value
 */
jsmb.set = function (key, val) {
    if (typeof key === 'object') {
        for (var itm in key) {
            if (itm in jsmb.config) {
                jsmb.config[itm] = key[itm];
            }
        }
    } else {
        jsmb.config[key] = val;
    }
}


/**
 * 初始化配置文件
 *
 * @param configpath
 */
function initConfig(configpath) {
    try {
        eval(fs.readFileSync(configpath, 'utf-8'));
    } catch (e) {
        console.log(e);
    }

    // 对所有路径统一做处理
    var go = jsmb.util.path;

    jsmb.config.src = go(jsmb.config.src);
    jsmb.config.dest = go(jsmb.config.dest);
    jsmb.config.view = go(jsmb.config.view);

    jsmb.config.realtimeI18n.xgettextSrc = go(jsmb.config.realtimeI18n.xgettextSrc);
    jsmb.config.realtimeI18n.resourceSrc = go(jsmb.config.realtimeI18n.resourceSrc);
    jsmb.config.realtimeI18n.resourceDest = go(jsmb.config.realtimeI18n.resourceDest);
    jsmb.config.realtimeI18n.viewSrc = go(jsmb.config.realtimeI18n.viewSrc);
    jsmb.config.realtimeI18n.viewDest = go(jsmb.config.realtimeI18n.viewDest);
    jsmb.config.realtimeI18n.destDir = go(jsmb.config.realtimeI18n.destDir);

    jsmb.config.i18n.xgettextSrc = go(jsmb.config.i18n.xgettextSrc);
    jsmb.config.i18n.resourceSrc = go(jsmb.config.i18n.resourceSrc);
    jsmb.config.i18n.resourceDest = go(jsmb.config.i18n.resourceDest);
    jsmb.config.i18n.viewSrc = go(jsmb.config.i18n.viewSrc);
    jsmb.config.i18n.viewDest = go(jsmb.config.i18n.viewDest);
    jsmb.config.i18n.destDir = go(jsmb.config.i18n.destDir);

    jsmb.config.uglifyjs ? jsmb.config.uglifyjs.cwd = go(jsmb.config.uglifyjs.cwd) : jsmb.config.uglifyjs = false;
    jsmb.config.minifycss ? jsmb.config.minifycss.cwd = go(jsmb.config.minifycss.cwd) : jsmb.config.minifycss = false;
}



// 参数为: [node, 'exec_path', 'config_path', 'dir', 'file', 'event']
// node命令，当前文件路径，jsmb配置文件路径，变更的文件所在文件夹，变更的文件名，此变更的事件名称
var argv = process.argv;

if(argv[argv.length - 1] !== "DELETE"){
    try{
        initConfig(argv[2]);
        run(path.join(argv[3], argv[4]), jsmb.config.src, jsmb.util.path(jsmb.config.dest), jsmb.util.path(jsmb.config.view), function () {
            var i18n = require('jsmb-i18n');
            var xmlFile, map = jsmb.config.realtimeI18n.map;

            for (var itm in jsmb.config.realtimeI18n.langList) {
                xmlFile = path.join(jsmb.config.realtimeI18n.destDir, jsmb.config.realtimeI18n.langList[itm]);
                i18n.xml.xgettext(jsmb.config.realtimeI18n.xgettextSrc, path.dirname(xmlFile), xmlFile);
            }
            for (var itm in jsmb.config.realtimeI18n.langList) {
                xmlFile = path.join(jsmb.config.realtimeI18n.destDir, jsmb.config.realtimeI18n.langList[itm]);
                fs.existsSync(jsmb.config.realtimeI18n.resourceSrc) ? i18n.xml.gettext(itm, xmlFile, jsmb.config.realtimeI18n.resourceSrc, map ? jsmb.config.realtimeI18n.resourceDest.replace(map, itm) : jsmb.config.realtimeI18n.resourceDest) : null;
                fs.existsSync(jsmb.config.realtimeI18n.viewSrc) ? i18n.xml.gettext(itm, xmlFile, jsmb.config.realtimeI18n.viewSrc, map ? jsmb.config.realtimeI18n.viewDest.replace(map, itm) : jsmb.config.realtimeI18n.viewDest) : null;
            }
        }, jsmb.util.path('_jsmb_/rsync.time'), jsmb.config.ignore, null, null, jsmb.config.viewFlat);
    }catch(e){
        CHILDPROCESS.exec('echo ' + e + ' >> /home/pakinguo/inotify-test/i.log', function(err, stdout, stderr){
        });
    }
}




/**
 * 实时监听同步文件
 *
 * @param {String} filePath  变更文件的全路径
 * @param {String} src  监听的源路径
 * @param {String} resDest  同步的静态资源目标路径
 * @param {String} viewDest 同步的view页面目标路径
 * @param {RegExp} ignore 不需要同步文件的正则表达式
 * @param {function} callback 回调
 * @param {RegExp} pattern  判断是静态资源还是view页面的正则
 * @param {RegExp} viewPattern  pattern的子集，根据需要可以不用同步没有页面的文件夹
 */
function run(filePath, src, resDest, viewDest, callback, recordPath, ignore,  pattern, viewPattern, viewFlat) {
    // 确保路径是以 / 分割
    src = src.replace(/\\/g, '/');
    var file = path.relative(src, filePath).replace(/\.\.\//g, '');
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
        if(!fs.existsSync(srcFile)){
            return;
        }
        var mtime = fs.statSync(srcFile).mtime.getTime();
        if(mtime === recode[srcFile]){
            return;
        }

        // 记录最后修改时间
        recode[srcFile] = mtime;
        fs.writeFileSync(recordPath, JSON.stringify(recode), 'utf8');  // 未校验文件夹是否存在，TODO

    var logFile;
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

        // 打日志
        console.log('[DO-SYNC]'.green + ' ... ' + filename);

        typeof callback === "function" ? callback() : null;
    }

}

