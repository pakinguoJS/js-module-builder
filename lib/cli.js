'use strict';

var fs = require('fs');
var path = require('path');
var Colors = require('colors');
var Util = require('jsmb-util');


/**
 * @class Jsmb
 *
 */
var jsmb = {};


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
 * 工具集
 */
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


// jsmb的配置对象
// 具体配置的可以参考demo中的配置
jsmb.config = {
    "src": "./",                    // 开发源代码目录
    "dest": "../resource",          // 编译生成的静态文件目录
    "view": "../views/src",         // 编译生成的view层文件目录
    "viewFlat": false,
    "ignore": /_jsmb_|\.tmp$/,      // 同步过程中忽略的文件夹

    // 实时文件监听并同步翻译某种语言（可默认设置en或者其他目录，如：dist等）
    "realtimeI18n": {
        type: "xml",
        xgettextSrc: "./app/src",                   // 需要提取翻译字段的源路径
        resourceSrc: "../resource/app/src",         // 翻译的静态资源源模板的路径
        resourceDest: "../resource/app/{lang}",     // 翻译后的静态资源目标路径
        viewSrc: "../views/src",                    // 翻译的页面资源源模板的路径
        viewDest: "../views/{lang}",                // 翻译后的页面资源目标路径
        destDir: "_jsmb_/i18n",                     // 存放提取的翻译字段文件的文件夹
        map: /\{lang\}/,                            // 如果目标路径中存在需要替换的路径，则需要map指定替换的字符串
        langList: {                                 // 需要翻译的语言类型，字段为编译后生成的文件夹名，值为翻译提取的文件路径，需要跟destDir合成
            "en": "./xml/en/all.xml"
        }
    },

    // 翻译配置
    "i18n": {
        type: "xml",
        xgettextSrc: "./app/src",                   // 需要提取翻译字段的源路径
        resourceSrc: "../resource/app/src",         // 翻译的静态资源源模板的路径
        resourceDest: "../resource/app/{lang}",     // 翻译后的静态资源目标路径
        viewSrc: "../views/src",                    // 翻译的页面资源源模板的路径
        viewDest: "../views/{lang}",                // 翻译后的页面资源目标路径
        destDir: "_jsmb_/i18n",                     // 存放提取的翻译字段文件的文件夹
        map: /\{lang\}/,                            // 如果目标路径中存在需要替换的路径，则需要map指定替换的字符串
        langList: {                                 // 需要翻译的语言类型，字段为编译后生成的文件夹名，值为翻译提取的文件路径，需要跟destDir合成
            "en": "./xml/en/all.xml"
        }
    },

    // seajs transport，配置与grunt-cmd-transport一致
    "transport": false,

    // js uglify
    "uglifyjs": false,

    // css minify, 所有配置同uglify
    "minifycss": false,

    // 版本号控制
    "version": false,

    // 清除编译后生成的文件
    "clean": {
        files: [
            "../resource",
            "../views",
            "_jsmb_/rsync.time"
        ]
    },

    // 打包
    "pack": {
        cwd: "",
        src: [
            "../resource",
            "../views"
        ],
        destDir: "_jsmb_/pack"
    }
};


/**
 * 供执行的方式
 */
jsmb.run = function () {

    var argvs = process.argv;

    // 如果是js文档自动生成命令，则单独处理
    if (argvs[2] === "doc") {
        require('jsmb-jsdoc')(argvs[3], argvs[4], argvs);
        return;
    }

    // 如果是初始化功能，则不需要加载
    if (argvs[2] === "init") {
        if (fs.existsSync(jsmb.util.path('./_jsmb_/jsmb.conf.js'))) {
            console.log("[Error]".red + " ... File \"./_jsmb_/jsmb.conf.js\" is alreay existed!");
        } else {
            // 确保文件夹存在
            Util.mkdir("./_jsmb_");
            fs.writeFileSync("./_jsmb_/jsmb.conf.js", "jsmb.set(" + JSON.stringify(jsmb.config, null, 4) + ");", "utf-8");
            console.log("[OK]".green + " ... File \"./_jsmb_/jsmb.conf.js\" has been initialized!");
        }
        return;
    }

    // 如果是非命令，则提示help
    var command = {
        "watch": 1,
        "xgettext": 1,
        "gettext": 1,
        "release": 1,
        "clean": 1,
        "pack": 1
    }
    if (!(argvs[2] in command)) {
        help();
        return;
    }

    // 添加cwd
    jsmb.config.cwd = process.cwd();

    // 初始化配置，默认读取当前路径的_jsmb_文件夹下的jsmb.conf.js文件
    initConfig(argvs.length > 4 ? jsmb.util.path(argvs[3]) : jsmb.util.path('./_jsmb_/jsmb.conf.js'));

    switch (argvs[2]) {
        case 'watch':
            rsync();
            break;
        case 'xgettext':
            i18nXgettext();
            break;
        case 'gettext':
            i18nGettext();
            break;
        case 'release':
            release();
            break;
        case 'clean':
            clean();
            break;
        case 'pack':
            pack();
            break;
        case '-h':
        case '-help':
        default :
            help();
            break;
    }

}


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


/**
 * 实时文件监听及同步
 * 按适合项目的规则，从front同步到resource，除去tpl的直接复制，转为将tpl存储到指定的路径下，并压缩为两层目录结构
 */
function rsync() {
    require('./task/rt-sync.js')(jsmb.config.src, jsmb.util.path(jsmb.config.dest), jsmb.util.path(jsmb.config.view), function () {
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

    //console.log("[OK]".green + " ... Realtime moditor is running now!");
}


function doSync(){
    var sync = require('./task/do-sync.js');
    var csrc = jsmb.config.src.replace(/\\/g, '/');
    travel(csrc);

    function travel(src) {
        var ll = fs.readdirSync(src);
        ll.forEach(function (file) {
            var filepath = path.join(src, file).replace(/\\/g, '/');
            // 递归
            if (fs.statSync(filepath).isDirectory()) {
                travel(filepath);
            }else{
                sync(filepath.replace(csrc, ''), jsmb.config.src, jsmb.util.path(jsmb.config.dest), jsmb.util.path(jsmb.config.view), jsmb.util.path('_jsmb_/rsync.time'), jsmb.config.ignore, null, null, jsmb.config.viewFlat);
            }
        });
    }

}


/**
 * seajs transport
 */
function transport() {
    var transport = require('jsmb-cmd-transport');
    transport({
            files: jsmb.config.transport.files
        },
        jsmb.config.transport.options || {},
        jsmb.config.transport.parser || {
            '.js': 1,
            '.css': 1
        });
}


/**
 * js uglify
 */
function uglifyjs() {
    var Uglifyjs = require('jsmb-uglifyjs');

    var files;
    var cwd = jsmb.config.uglifyjs.cwd || jsmb.config.dest;

    // 需要对参数进行合成路径
    // 根据参数vars中存在的lang数值，对路径中存在map的字符串进行替换
    if (jsmb.config.uglifyjs.vars && jsmb.config.uglifyjs.vars.lang) {
        var map = jsmb.config.uglifyjs.vars.map;
        jsmb.config.uglifyjs.vars.lang.forEach(function (lang) {
            jsmb.config.uglifyjs.files.forEach(function (file) {
                cwd = file.cwd || cwd;
                files = [];
                file.src.forEach(function (i) {
                    files.push(path.join(cwd, i).replace(map, lang));
                });
                Uglifyjs(path.join(cwd, file.dest).replace(map, lang), files);
            });
        });
    } else {
        jsmb.config.uglifyjs.files.forEach(function (file) {
            cwd = file.cwd || cwd;
            files = [];
            file.src.forEach(function (i) {
                files.push(path.join(cwd, i));
            });
            Uglifyjs(path.join(cwd, file.dest), files);
        });
    }
}


/**
 * css minify
 */
function minifycss() {
    var Minifycss = require('jsmb-minifycss');

    var files;
    var cwd = jsmb.config.minifycss.cwd || jsmb.config.dest;

    // 同uglify
    if (jsmb.config.minifycss.vars && jsmb.config.minifycss.vars.lang) {
        var map = jsmb.config.minifycss.vars.map;
        jsmb.config.minifycss.vars.lang.forEach(function (lang) {
            jsmb.config.minifycss.files.forEach(function (file) {
                cwd = file.cwd || cwd;
                files = [];
                file.src.forEach(function (i) {
                    files.push(path.join(cwd, i).replace(map, lang));
                });
                Minifycss(path.join(cwd, file.dest).replace(map, lang), files);
            });
        });
    } else {
        jsmb.config.minifycss.files.forEach(function (file) {
            cwd = file.cwd || cwd;
            files = [];
            file.src.forEach(function (i) {
                files.push(path.join(cwd, i));
            });
            Minifycss(path.join(cwd, file.dest), files);
        });
    }
}


/**
 * i18n gettext
 * langList is required
 */
function i18nGettext() {
    var i18n = require('jsmb-i18n');
    var xmlFile, map = jsmb.config.i18n.map;
    for (var itm in jsmb.config.i18n.langList) {
        xmlFile = path.join(jsmb.config.i18n.destDir, jsmb.config.i18n.langList[itm]);
        i18n.xml.gettext(itm, xmlFile, jsmb.config.i18n.resourceSrc, map ? jsmb.config.i18n.resourceDest.replace(map, itm) : jsmb.config.i18n.resourceDest);
        i18n.xml.gettext(itm, xmlFile, jsmb.config.i18n.viewSrc, map ? jsmb.config.i18n.viewDest.replace(map, itm) : jsmb.config.i18n.viewDest);
    }
}


/**
 * i18n xgettext
 * langList is required
 */
function i18nXgettext() {
    var i18n = require('jsmb-i18n');
    var xmlFile;
    for (var itm in jsmb.config.i18n.langList) {
        xmlFile = path.join(jsmb.config.i18n.destDir, jsmb.config.i18n.langList[itm]);
        i18n.xml.xgettext(jsmb.config.i18n.xgettextSrc, path.dirname(xmlFile), xmlFile);
    }
}


/**
 * 打包代码
 */
function pack() {
    require("jsmb-tar")(jsmb.config.pack.src.join(" "), jsmb.config.pack.destDir);
}


/**
 * version
 */
function version() {
    var Version = require("../node_modules/jsmb-version/version.js")(jsmb.config.version.type);

    // 同uglify，需要对参数做多语言路径替换
    if (jsmb.config.version.vars && jsmb.config.version.vars.lang) {
        var aliasSrc = jsmb.config.version.options.alias || null;
        var options = {
            alias: {},
            map: jsmb.config.version.options.map
        };
        var map = jsmb.config.version.vars.map || /\{lang\}/;

        // 将option中的map缓存起来
        var optionsMap = jsmb.config.version.options ? jsmb.config.version.options.map ? jsmb.config.version.options.map : [] : [];

        jsmb.config.version.vars.lang.forEach(function (lang) {
            // alias的多语言替换
            if (aliasSrc) {
                for (var itm in aliasSrc) {
                    options.alias[itm] = aliasSrc[itm].replace(map, lang);
                }
            }

            // 不同语言对于cmd的版本号控制需要对应不同的map
            var tmpMap = cloneArray(optionsMap);
            tmpMap.push([map, lang]);
            options.map = tmpMap;

            if (jsmb.config.version.src instanceof Array) {
                jsmb.config.version.src.forEach(function (i) {
                    travel(i.replace(map, lang), options);
                });
            } else {
                travel(jsmb.config.version.src.replace(map, lang), options);
            }
        });
    } else {
        if (jsmb.config.version.src instanceof Array) {
            jsmb.config.version.src.forEach(function (itm) {
                travel(itm, jsmb.config.version.options);
            });
        } else {
            travel(jsmb.config.version.src, jsmb.config.version.options);
        }
    }


    /**
     * 遍历文件夹下所有文件
     * @param {string} src
     * @param {object} options 通常只需要配置alias和map字段
     */
    function travel(src, options) {
        var ll = fs.readdirSync(src);
        ll.forEach(function (file) {
            var filepath = path.join(src, file).replace(/\\/g, '/');
            if (jsmb.config.version.exclude.test(filepath)) {
                return;
            }

            // 递归
            if (fs.statSync(filepath).isDirectory()) {
                travel(filepath, options);
                return;
            }

            // 处理的内容
            var ret, content;

            if (/\.(js|css)$/.test(filepath)) {
                // 如果是css或js文件，则只处理图片资源
                ret = Version.image(jsmb.config.dest, filepath, options);
                if (ret) {
                    content = fs.readFileSync(filepath, 'utf8');
                    ret.forEach(function (i) {
                        content = content.replace(new RegExp(i.src.replace(/[\(\[\{\\\^\$\|\)\?\*\+\.]/g, "\\$&"), 'g'), i.val);
                    });
                    fs.writeFileSync(filepath, content, 'utf8');
                }
            } else if (/\.(tpl|html|htm)$/.test(filepath)) {
                content = fs.readFileSync(filepath, 'utf8');

                // 如果是view层的文件，则处理所有的
                // cmd
                ret = Version.cmd(jsmb.config.dest, filepath, options);
                content = content.replace("//@version cmd", ret);
                // usecss
                ret = Version.usecss(jsmb.config.dest, filepath, options);
                content = content.replace("//@version css", ret);
                // linkscript
                ret = Version.linkscript(jsmb.config.dest, filepath, options);
                ret.forEach(function (i) {
                    content = content.replace(i.src, i.val);
                });
                // linkcss
                ret = Version.linkcss(jsmb.config.dest, filepath, options);
                ret.forEach(function (i) {
                    content = content.replace(i.src, i.val);
                });
                // image
                ret = Version.image(jsmb.config.dest, filepath, options);
                ret.forEach(function (i) {
                    content = content.replace(new RegExp(i.src.replace(/[\(\[\{\\\^\$\|\)\?\*\+\.]/g, "\\$&"), 'g'), i.val);
                });
                fs.writeFileSync(filepath, content, 'utf8');
            }
        });
    }

    function cloneArray(src){
        return JSON.parse(JSON.stringify(src));
    }
}


/**
 * 在进行transport、uglifyjs、minifycss和version前，先备份src下的文件
 * @param {number} time 时间戳
 */
function copyBeforeRelease(time) {
    Util.cp(jsmb.config.i18n.resourceSrc, path.join(jsmb.config.cwd, '_jsmb_/temp/resource' + time));
    Util.cp(jsmb.config.i18n.viewSrc, path.join(jsmb.config.cwd, '_jsmb_/temp/views' + time));
}


/**
 * 在完成transport、uglifyjs、minifycss和version后，恢复之前备份的src文件
 * @param {number} time 时间戳
 */
function resetAfterRelease(time) {
    var resourcePath = path.join(jsmb.config.cwd, '_jsmb_/temp/resource' + time);
    var viewPath = path.join(jsmb.config.cwd, '_jsmb_/temp/views' + time);
    Util.cp(resourcePath, jsmb.config.i18n.resourceSrc);
    Util.cp(viewPath, jsmb.config.i18n.viewSrc);
    Util.rm(path.join(jsmb.config.cwd, '_jsmb_/temp'));
}


/**
 * release 流程
 */
function release() {
    var start = new Date().getTime();

    // 0. 预处理，把未实时监听修改的src同步到对应目录 TODO
    doSync();
    console.log("[OK]".green + " ... sync".yellow);

    // 1. 翻译
    i18nGettext();
    console.log("[OK]".green + " ... i18n".yellow);

    // 2. 备份src
    copyBeforeRelease(start);

    // 3. transport
    if(jsmb.config.transport){
        transport();
        console.log("[OK]".green + " ... transport".yellow);
    }

    // 4. uglifyjs & minifycss
    if(jsmb.config.uglifyjs){
        uglifyjs();
        console.log("[OK]".green + " ... uglifyjs".yellow);
    }
    if(jsmb.config.minifycss){
        minifycss();
        console.log("[OK]".green + " ... minifycss".yellow);
    }

    // 5. version
    if(jsmb.config.version) {
        version();
        console.log("[OK]".green + " ... version".yellow);
    }

    // 6. 还原备份
    resetAfterRelease(start);
    console.log("=============================".yellow);
    console.log("Build in " + ((new Date().getTime() - start) / 1000).toString().green + "s");
}


/**
 * 清除编译生成的所有文件
 */
function clean() {
    if (jsmb.config.clean.files) {
        jsmb.config.clean.files.forEach(function (file) {
            Util.rm(jsmb.util.path(file));
        });
    }
}


/**
 * log 命令帮助
 */
function help() {
    console.log("\
============================================================================================\n\
Usage A:\n\
  jsmb-start          Linux下开启后台进程实时文件监听（同步文件）\n\
  jsmb-stop           Linux下关闭后台实时监听进程\n\
--------------------------------------------------------------------------------------------\n\
Usage B: jsmb [type]\n\
  [Options]             [Description]\n\
    init                初始化配置文件jsmb.conf.js，默认保存在当前路径下的_jsmb_/jsmb.conf.js\n\
    watch [confPath]    对当前路径开启实时文件监听（Linux下建议使用jsmb-start）\n\
                        参数confPath可制定配置文件的路径\n\
    xgettext [confPath] 提取待翻译的字段，[lang]支持多语言，不同语言间用", "隔开\n\
    gettext [confPath]  根据指定语言类型翻译已提取的字段，[lang]同xgettext\n\
    release [confPath]  根据配置文件制定的编译功能进行全局编译\n\
    clean [confPath]    清除制定的文件（夹）\n\
    doc [src] [dist]    JS文档自动化生成，src指定自动化检索的源文件夹，dist指定生成的文档路径。\n\
============================================================================================"
    );
}


module.exports = jsmb;
