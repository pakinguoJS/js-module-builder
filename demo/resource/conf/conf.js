(function(seajs){
    // set base path
    var base = "/pakinguo/demo/resource/";

    seajs.config({
        base: base,
        vars: {
            'lang': 'en'
        },
        alias: {
            "index": "app/{lang}/test/js/index.js",
            "test": "app/{lang}/test/js/test.js"
        },
        debug: false
    });

    seacss.config({
        base: base
    });

})(seajs);

