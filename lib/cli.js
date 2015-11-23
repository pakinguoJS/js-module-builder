'use strict';

var fs = require('fs');
var path = require('path');
//var colors = require('colors');


/**
 * @class Jsmb
 *
 */
var jsmb = {};


// jsmb的配置对象
jsmb.config = {
    "base": "./",
    "src": "./",
    "dest": "./resource",
    "view": "./views",
    "version": "time",
    "i18n": false,
    "realtimeI18n": false,
    "transport": false,
    "uglifyjs": [
        {
            "cwd": "",
            "dst": "",
            "src": []
        }
    ],
    "minifycss": [
        {
            "cwd": "",

        }
    ]
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
 * 工具集
 */
jsmb.util = {
    path: function (url) {
        if (/^\./.test(url)) {
            return path.join(process.cwd(), url).replace(/\\/g, "/");
        } else {
            return url;
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
 * 供执行的方式
 */
jsmb.run = function () {

    var argvs = process.argv;
    jsmb.config.cwd = process.cwd();

    // 如果是js文档自动生成命令，则单独处理
    if (argvs[2] === "doc") {
        require('jsmb-jsdoc')(argvs[3], argvs[4]);
        return;
    }

    // 初始化配置，默认读取当前路径的_jsmb_文件夹下的jsmb.conf.js文件；
    try {
        if (argvs.length > 4) {
            eval(fs.readFileSync(jsmb.util.path(argvs[3]), 'utf-8'));
        } else {
            eval(fs.readFileSync(jsmb.util.path('./_jsmb_/jsmb.conf.js'), 'utf-8'));
        }
    } catch (e) {
        console.log(e);
    }

    switch (argvs[2]) {
        case 'init':
            break;
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
            break;
    }

}





function rsync() {
    require('./rt-sync.js')(jsmb.config.base, jsmb.util.path(jsmb.config.dest), jsmb.util.path(jsmb.config.view));
}

function transport() {
    require('jsmb-cmd-transport')(jsmb.config.transport.files, jsmb.config.transport.alias || {}, jsmb.config.transport.parser || {
            '.js': 1,
            '.css': 1
        });
}

function uglifyjs() {
    var uglifyjs = require('jsmb-uglifyjs');
    jsmb.config.uglifyjs.forEach(function (item) {
        uglifyjs(jsmb.util.path(item.cwd || jsmb.config.cwd, item.dest), jsmb.util.join(item.cwd || jsmb.config.cwd, item.src))
    });
}

function minifycss() {
    var minifycss = require('jsmb-minifycss');
    jsmb.config.minifycss.forEach(function (item) {
        uglifyjs(jsmb.util.path(item.cwd || jsmb.config.cwd, item.dest), jsmb.util.join(item.cwd || jsmb.config.cwd, item.src))
    });
}

function i18nGettext() {
    var i18n = require('jsmb-i18n');
    var destDir;
    for (var itm in js.config.i18n.langList) {
        destDir = js.config.i18n.destDir, js.config.i18n.langList[itm];
        i18n.xml.gettext(itm, destDir, js.config.src, js.config.dest);
        i18n.xml.gettext(itm, destDir, js.config.src, js.config.view);
    }
}

function i18nXgettext() {
    var i18n = require('jsmb-i18n');
    var destDir;
    for (var itm in js.config.i18n.langList) {
        destDir = js.config.i18n.destDir, js.config.i18n.langList[itm];
        i18n.xml.xgettext(js.config.src, path.dirname(destDir), destDir);
    }
}

function version() {
    var version = require("../node_modules/jsmb-version/version.js")(js.config.version.type);
    travel(js.config.dest);
    travel(js.config.view);

    function travel(src) {
        var ll = fs.readdirSync(src);
        ll.forEach(function (file) {
            var filepath = path.join(src, file).replace(/\\/g, '/');
            if (js.config.version.exclude.test(filepath)) {
                return;
            }

            // 递归
            if (fs.statSync(filepath).isDirectory()) {
                travel(path);
                return;
            }

            // 处理的内容
            var ret, content;

            if (/\.(js|css)$/.test(filepath)) {
                // 如果是css或js文件，则只处理图片资源
                ret = version.image(js.config.dest, filepath, js.config.version.options);
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
                ret = version.cmd(js.config.dest, filepath, js.config.version.options);
                content = content.replace("//@version cmd", ret);
                // usecss
                ret = version.usecss(js.config.dest, filepath, js.config.version.options);
                content = content.replace("//@version css", ret);
                // linkcss
                ret = version.linkcss(js.config.dest, filepath, js.config.version.options);
                ret.forEach(function(i){
                    content = content.replace(i.src, i.val);
                });
                // image
                ret = version.image(js.config.dest, filepath, js.config.version.options);
                ret.forEach(function (i) {
                    content = content.replace(new RegExp(i.src.replace(/[\(\[\{\\\^\$\|\)\?\*\+\.]/g, "\\$&"), 'g'), i.val);
                });
                fs.writeFileSync(filepath, content, 'utf8');
            }
        });
    }
}

function release() {
    // 0. 预处理，把未实时监听修改的src同步到对应目录 TODO

    // 1. 翻译
    i18nGettext();

    // 2. transport
    transport();

    // 3. uglifyjs & minifycss
    uglifyjs();
    minifycss();

    // 4. version
    version();
}


function help() {
    console.log("\
Usage: jsb [type]\n\
options:            description:\n\
  init                初始化bjs.conf.js文件\n\
  watch               开启实时文件监听\n\
  stop                当使用bin/jsb.sh运行后台守护进程时，使用此命令来停止后台进程\n\
  clear               清除生成的旧的版本号文件\n\
  xgettext [lang]     提取待翻译的字段，[lang]支持多语言，不同语言间用", "隔开\n\
  gettext [lang]      根据指定语言类型翻译已提取的字段，[lang]同xgettext\n");
}


module.exports = jsmb;
