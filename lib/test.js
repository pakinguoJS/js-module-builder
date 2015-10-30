/**
 * Created by pakinguo on 2015/9/25.
 */
var fs = require('fs');
var path = require('path');

var md5 = require('md5');

var s = new Date().getTime();
var rs = [];
//if(process.argv.length === 3){
//    travel(process.argv[2]);
//}
//console.log(fs.statSync(process.argv[2]));
//
//function copy(){
//
//}
//
//function travel(src){
//    var ll = fs.readdirSync(src);
//    ll.forEach(function(item){
//        var filename = path.join(src, item);
//        var state = fs.statSync(filename);
//        if(state.isDirectory()){
//            travel(filename);
//        }else{
//            rs.push(md5(fs.readFileSync(filename)));
//            //rs.push(fs.statSync(filename).mtime.getTime());
//        }
//    });
//}


// rt-sync.js 同步脚本测试
//var cwd = process.cwd();
//var rtSync = require('./rt-sync.js');
//rtSync(cwd, path.join(path.dirname(cwd), 'resource'), path.join(path.dirname(cwd), 'views'));


// transport 测试
//var transport = require("../node_modules/jsmb-cmd-transport/transport.js");
//transport({
//        files: [{
//            expand: true,
//            cwd: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front",
//            src: "**/*.js",
//            dest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource"
//        }]
//    },
//    {},
//    {
//        '.js': 1,
//        '.css': 1
//    });


// uglify 测试
//var uglify = require("../node_modules/jsmb-uglifyjs/uglifyjs.js");
//uglify("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/js/index.js",
//    [
//        "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/js/index.js",
//        "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/js/alert.js",
//        "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/js/a.js",
//        "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/js/b.js",
//        "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/md1/js/md1.index.js",
//        "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/md1/js/md2.js"
//    ]
//);


// css minify 测试
//var minifycss = require("../node_modules/jsmb-minifycss/minifycss.js");
//minifycss("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/static/css/reset.css", ["D:/Pakinguo_documents/My Github/js-module-builder/demo/front/static/css/reset.css", "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/static/css/a.css"])


// version 测试
//var version = require("../node_modules/jsmb-version/version.js")('time');
//var versionCmdMap = version.cmd(
//    "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
//    "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/view/index.html",
//    {
//        map: [[/\{lang\}/, 'app']],
//        alias: {
//            "index": "{lang}/test/js/index.js"
//        }
//    });
//var versionUsecssMap = version.usecss("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource", "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/view/index.html", {map: [[/\{lang\}/, 'app']]});
//var versionLinkcssMap = version.linkcss("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource", "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/view/index.html", {map: [[/\{\$BASE\}/, 'D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/']]});
//var versionImageMap = version.image("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource", "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/view/index.html", {map: [[/\{lang\}/, 'app']]});
//var content = fs.readFileSync("D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/view/index.html", 'utf8');
//
//// link css标签方式
//versionLinkcssMap.forEach(function(i){
//    content = content.replace(i.src, i.val);
//});
//// use css和js 方式
//content = content.replace("//@version cmd", versionCmdMap).replace("//@version css", versionUsecssMap);
//// image方式
//versionImageMap.forEach(function(i){
//   content = content.replace(new RegExp(i.src.replace(/[\(\[\{\\\^\$\|\)\?\*\+\.]/g, "\\$&"), 'g'), i.val);
//});
//fs.writeFileSync
//(
//    "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/view/index.html",
//    content,
//    'utf8'
//);
//
//// css 文件替换测试
//var versionImageMap2 = version.image("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource", "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/css/a.css", {map: [[/\{lang\}/, 'app']]});
//var content2 = fs.readFileSync("D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/css/a.css", 'utf8');
//versionImageMap2.forEach(function(i){
//    content2 = content2.replace(new RegExp(i.src.replace(/[\(\[\{\\\^\$\|\)\?\*\+\.]/g, "\\$&"), 'g'), i.val);
//});
//fs.writeFileSync
//(
//    "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/css/a.css",
//    content2,
//    'utf8'
//);



// 翻译
var i18nxml = require('../node_modules/jsmb-i18n/lib/i18n-xml.js');
var src = "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app";
var dist = "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app";
var dest = "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/_build/i18n/";
i18nxml.gettext('en', dest + "xml/en/all.xml", dist + '/test/view/index.html', dist + '/test/view/index.html');
//i18nxml.xgettext(src, dest + "xml/en", dest + "xml/en/all.xml");
