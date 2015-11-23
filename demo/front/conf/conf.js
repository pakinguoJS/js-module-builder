(function(seajs){
    // set base path
    var base = "/pakinguo/demo/resource/";

    seajs.config({
        base: base,
        vars: {
            'lang': 'src'
        },
        alias: {
            "index": "{lang}/test/js/index.js"
        },
        debug: false
    });

    seacss.config({
        base: base
    });

})(seajs);

