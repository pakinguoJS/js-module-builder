define("app/en/test/js/alert", [ "../../md1/js/md1.index", "../../md1/js/md2" ], function(require, module, exports) {
    alert("aaa");
    require("../../md1/js/md1.index");
    require("../../md1/js/md2");
});