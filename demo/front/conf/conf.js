(function(seajs){
    // set base path
    var base = "/pakinguo/demo/resource/";

    seajs.config({
        base: base,
        vars: {
            'lang': 'app'
        },
        alias: '',
        map: [
            ["app/test/js/index.js", "app/test/js/index.js?v=0.11"]
        ],
        debug: false
    });

})(seajs);

