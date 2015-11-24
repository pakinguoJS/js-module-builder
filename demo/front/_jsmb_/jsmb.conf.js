jsmb.set({
    "base": "D:/Pakinguo_documents/My Github/js-module-builder/demo/front",
    "src": "D:/Pakinguo_documents/My Github/js-module-builder/demo/front",
    "dest": "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
    "view": "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/src",

    "realtimeI18n": {
        src: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/src",
        resourceSrc: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/src",
        resourceDest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/{lang}",
        viewSrc: "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/src",
        viewDest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/{lang}",
        type: "xml",
        destDir: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/_jsmb_/i18n",
        langList: {
            "en": "./xml/en/all.xml"
        }
    },

    "i18n": {
        src: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/src",
        resourceSrc: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/src",
        resourceDest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/{lang}",
        viewSrc: "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/src",
        viewDest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/{lang}",
        type: "xml",
        destDir: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/_jsmb_/i18n",
        langList: {
            "en": "./xml/en/all.xml",
            "cn": "./xml/cn/all.xml"
        }
    },

    "transport": {
        files: [
            {
                expand: true,
                cwd: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
                src: "app/en/**/*.js",
                dest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource"
            },{
                expand: true,
                cwd: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
                src: "app/cn/**/*.js",
                dest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource"
            }

        ],
        options: {
            "var": {
                "lang": "en"
            },
            "alias": {
                "index": "app/{lang}/test/js/index.js",
                "alert": "app/{lang}/test/js/alert.js"
            }
        }
    },

    "uglifyjs": {
        vars: {
            lang: ["en", "cn"],
            map: /\{lang\}/
        },
        cwd: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
        files: [
            {
                "cwd": "", // 不填写则默认使用上一层cwd字段的值
                "dest": "app/{lang}/test/js/index.js",
                "src": [
                    "app/{lang}/test/js/index.js",
                    "app/{lang}/test/js/alert.js",
                    "app/{lang}/test/js/a.js",
                    "app/{lang}/test/js/b.js",
                    "app/{lang}/md1/js/md1.index.js",
                    "app/{lang}/md1/js/md2.js"
                ]
            }
        ]
    },

    "minifycss": {
        vars: {
            lang: ["en", "cn"],
            map: /\{lang\}/
        },
        cwd: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource",
        files: [
            {
                "cwd": "", // 不填写则默认使用上一层cwd字段的值
                "dest": "static/css/reset.css",
                "src": [
                    "static/css/reset.css"
                ]
            },
            {
                "dest": "static/css/test/a.css",
                "src": [
                    "static/css/test/a.css",
                    "static/css/test/b.css"
                ]
            }
        ]
    },

    "version": {
        type: "time",
        exclude: /\/lib\/|\/src\//,
        vars: {
            lang: ["en", "cn"],
            map: /\{lang\}/
        },
        src: [
            "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/{lang}",
            "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/static",
            "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/{lang}"
        ],
        options: {
            alias: {
                "index": "app/{lang}/test/js/index.js"
            }
        }
    },
});
