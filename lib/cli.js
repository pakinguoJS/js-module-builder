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


jsmb.util = {
    path: function (url) {
        if (/^[a-zA-Z]:|\//.test(url)) {
            return url;
        } else {
            return path.join(process.cwd(), url).replace(/\\/g, "/");
        }
    },
    join: function(cwd, list){
        var output = [];
        list.forEach(function(item){
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
    if(argvs[2] === "doc"){
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
            break;
        case 'gettext':
            break;
        case 'release':
            break;
    }

}


/**
 * 设置jsmb参数
 * @param {string||object} key 配置的key或对象
 * @param {string} val 当key为string时，此值为key对应的value
 */
jsmb.set = function (key, val) {
    if (typeof key === 'Object') {
        for (var itm in key) {
            if (itm in jsmb.config) {
                jsmb.config[itm] = key[itm];
            }
        }
    } else {
        jsmb.config[key] = val;
    }
}


function rsync() {
    require('jsmb-sync')(jsmb.config.cwd, jsmb.util.path(jsmb.config.src), jsmb.util.path(jsmb.config.view));
}

function transport() {
    require('jsmb-cmd-transport')(jsmb.config.transport.files, jsmb.config.transport.alias || {}, jsmb.config.transport.parser || {'.js':1,'.css':1});
}

function uglifyjs() {
    var uglifyjs = require('jsmb-uglifyjs');
    jsmb.config.uglifyjs.forEach(function(item){
        uglifyjs(jsmb.util.path(item.cwd || jsmb.config.cwd, item.dest), jsmb.util.join(item.cwd || jsmb.config.cwd, item.src))
    });
}

function minifycss() {
}

function version() {
}

function i18n() {
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
