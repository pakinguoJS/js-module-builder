jsmb.set({
    "base": "D:/Pakinguo_documents/My Github/js-module-builder/demo/front",
    "src": "D:/Pakinguo_documents/My Github/js-module-builder/demo/front",
    "dest": "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
    "view": "D:/Pakinguo_documents/My Github/js-module-builder/demo/views",
    "version": {
        type: "time",
        exclude: /[\s]*\/lib/,
        options: {
            map: []
        }
    },
    "i18n": {
        src: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
        type: "xml",
        destDir: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/_build/i18n",
        langList: {
            "en": "./xml/en/all.xml",
            "zh_TW": "./xml/zh_TW/all.xml",
            "zh_CN": "./xml/zh_CN/all.xml",
            "id_ID": "./xml/id_ID/all.xml",
            "ms_MY": "./xml/ms_MY/all.xml",
            "th_TH": "./xml/th_TH/all.xml"
        }
    },
    "realtimeI18n": {
        type: "xml",
        destDir: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/_build/i18n",
        langList: {
            "en": "./xml/en/all.xml"
        }
    },
    "transport": {
        "alias": {},
        "parser": {
            ".js": true
        }
    },
    "uglifyjs": [
        {
            "cwd": "", // 不填写则默认使用 dest 字段的值
            "dest": "src/test/js/index.js",
            "src": [
                "src/test/js/index.js", "src/test/js/alert.js", "src/test/js/a.js", "src/test/js/b.js", "src/md1/js/md1.index.js", "src/md1/js/md2.js"
            ]
        },
        {}
    ],
    "minifycss": [
        {
            "cwd": "", // 不填写则默认使用 dest 字段的值
            "dest": "static/css/reset.css",
            "src": [
                "static/css/reset.css", "static/css/a.css"
            ]
        }
    ]
});
