define("app/cn/test/js/index",["./alert","../../md1/js/md1.index","../../md1/js/md2","test"],function(n,e,d){n("./alert"),n("test"),n.async(["./a.js","./b.js"],function(n,e){})}),define("app/cn/test/js/alert",["../../md1/js/md1.index","../../md1/js/md2"],function(n,e,d){alert("aaa"),n("../../md1/js/md1.index"),n("../../md1/js/md2")}),define("app/cn/test/js/a",[],function(n,e,d){console.log("a")}),define("app/cn/test/js/b",[],function(n,e,d){console.log("b")}),define("app/cn/md1/js/md1.index",[],function(n,e,d){console.log("md1"),console.log("this is a test")}),define("app/cn/md1/js/md2",[],function(n,e,d){console.log("md2")});