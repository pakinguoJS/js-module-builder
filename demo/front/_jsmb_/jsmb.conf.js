jsmg.set({
    "base": "D:/Pakinguo_documents/My Github/js-module-builder/demo/front",
    "src": "D:/Pakinguo_documents/My Github/js-module-builder/demo/front",
    "dest": "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
    "view": "D:/Pakinguo_documents/My Github/js-module-builder/demo/views",
    "version": "time",
    "i18n": {
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
            "dest": "app/test/js/index.js",
            "src": [
                "app/test/js/index.js", "app/test/js/alert.js", "app/test/js/a.js", "app/test/js/b.js", "app/md1/js/md1.index.js", "app/md1/js/md2.js"
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
