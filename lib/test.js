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
//minifycss(["D:/Pakinguo_documents/My Github/js-module-builder/demo/front/static/css/reset.css", "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/static/css/a.css"], "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/static/css/reset.css")


// version 测试
var version = require("../node_modules/jsmb-version/version.js")('time');
var versionMap = version.cmd("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource","D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/view/index.html", [[/\{lang\}/, 'app']]);
fs.writeFileSync("D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/test/view/index.html", fs.readFileSync("D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/test/view/index.html", 'utf8').replace("//@version cmd", versionMap), 'utf8');