define("app/test/js/index", [ "./alert", "../../md1/js/md1.index", "../../md1/js/md2" ], function(require, module, exports) {
    require("./alert");
    require.async([ "./a.js", "./b.js" ], function(a, b) {});
});