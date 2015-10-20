define("static/widgets/alert/alert", [], function(require, module, exports) {
    return function(msg) {
        console.log(msg);
        alert(msg);
    };
});