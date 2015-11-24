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
            release();
            break;
    }

}


function rsync() {
    require('./task/rt-sync.js')(jsmb.config.base, jsmb.util.path(jsmb.config.dest), jsmb.util.path(jsmb.config.view), function () {
        var i18n = require('jsmb-i18n');
        var xmlFile;
        for (var itm in jsmb.config.realtimeI18n.langList) {
            xmlFile = path.join(jsmb.config.realtimeI18n.destDir, jsmb.config.realtimeI18n.langList[itm]);
            fs.existsSync(jsmb.config.realtimeI18n.resourceSrc) ? i18n.xml.gettext(itm, xmlFile, jsmb.config.realtimeI18n.resourceSrc, jsmb.config.realtimeI18n.resourceDest.replace(/\{lang\}/, itm)) : null;
            fs.existsSync(jsmb.config.realtimeI18n.viewSrc) ? i18n.xml.gettext(itm, xmlFile, jsmb.config.realtimeI18n.viewSrc, jsmb.config.realtimeI18n.viewDest.replace(/\{lang\}/, itm)) : null;
        }
    });
}

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

function uglifyjs() {
    var Uglifyjs = require('jsmb-uglifyjs');

    var files;
    var cwd = jsmb.config.uglifyjs.cwd || jsmb.config.dest;

    // 需要对参数进行合成路径
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

function minifycss() {
    var Minifycss = require('jsmb-minifycss');

    var files;
    var cwd = jsmb.config.minifycss.cwd || jsmb.config.dest;

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

function i18nGettext() {
    var i18n = require('jsmb-i18n');
    var xmlFile;
    for (var itm in jsmb.config.i18n.langList) {
        xmlFile = path.join(jsmb.config.i18n.destDir, jsmb.config.i18n.langList[itm]);
        i18n.xml.gettext(itm, xmlFile, jsmb.config.i18n.resourceSrc, jsmb.config.i18n.resourceDest.replace(/\{lang\}/, itm));
        i18n.xml.gettext(itm, xmlFile, jsmb.config.i18n.viewSrc, jsmb.config.i18n.viewDest.replace(/\{lang\}/, itm));
    }
}

function i18nXgettext() {
    var i18n = require('jsmb-i18n');
    var xmlFile;
    for (var itm in jsmb.config.i18n.langList) {
        xmlFile = path.join(jsmb.config.i18n.destDir, jsmb.config.i18n.langList[itm]);
        i18n.xml.xgettext(jsmb.config.i18n.src, path.dirname(xmlFile), xmlFile);
    }
}

function version() {
    var Version = require("../node_modules/jsmb-version/version.js")(jsmb.config.version.type);

    if (jsmb.config.version.vars && jsmb.config.version.vars.lang) {
        var aliasSrc = jsmb.config.version.options.alias || null;
        var options = {
            alias: {}
        };
        var map = jsmb.config.version.vars.map || /\{lang\}/;
        jsmb.config.version.vars.lang.forEach(function (lang) {
            if (aliasSrc) {
                for (var itm in aliasSrc) {
                    options.alias[itm] = aliasSrc[itm].replace(map, lang);
                }
            }
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
