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

var cwd = process.cwd();
var rtSync = require('./rt-sync.js');
rtSync(cwd, path.join(path.dirname(cwd), 'resource'), path.join(path.dirname(cwd), 'views'));

