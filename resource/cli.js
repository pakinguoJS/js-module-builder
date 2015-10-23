'use strict';

var fs = require('fs');
var path = require('path');
//var colors = require('colors');


/**
 * @class Jsmb
 *
 */
var jsmb = {};

/**
 * 供执行的方式
 */
jsmb.run = function () {

    var argvs = process.argv;

    switch (argvs[2]) {
        case 'jsdoc':
            require('jsmb-jsdoc.js')(argvs[3], argvs[4]);
            break;
    }


}


jsmb.set = function(key, val){
    if(typeof key === 'Object'){

    }else{
        jsmb.config[key] = val;
    }
}


jsmb.config = {

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
