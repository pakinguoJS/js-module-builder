define("app/en/test/js/index",["./alert","../../md1/js/md1.index","../../md1/js/md2","test"],function(e,n,d){e("./alert"),e("test"),e.async(["./a.js","./b.js"],function(e,n){})}),define("app/en/test/js/alert",["../../md1/js/md1.index","../../md1/js/md2"],function(e,n,d){alert("aaa"),e("../../md1/js/md1.index"),e("../../md1/js/md2")}),define("app/en/test/js/a",[],function(e,n,d){console.log("a")}),define("app/en/test/js/b",[],function(e,n,d){console.log("b")}),define("app/en/md1/js/md1.index",[],function(e,n,d){console.log("md1"),console.log("侧个毛")}),define("app/en/md1/js/md2",[],function(e,n,d){console.log("md2")});