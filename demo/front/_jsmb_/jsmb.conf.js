jsmb.set({
	"src":  "./",             // 开发源代码目录
    "dest": "../resource",          // 编译生成的静态文件目录
    "view": "..//views/src",         // 编译生成的view层文件目录

    // 实时文件监听并同步编译某种语言（可默认设置en或者其他目录，如：dist等）
    "realtimeI18n": {
        type:           "xml",
        xgettextSrc:    "app/src",         // 需要提取翻译字段的源路径
        resourceSrc:    "../resource/app/src",      // 编译
        resourceDest:   "../resource/app/{lang}",
        viewSrc:        "../views/src",
        viewDest:       "../views/{lang}",
        destDir:        "_jsmb_/i18n",
        map: /\{lang\}/,
        langList: {
            "en": "./xml/en/all.xml"
        }
    },

    "i18n": {
        type: "xml",
        xgettextSrc: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/app/src",
        resourceSrc: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/src",
        resourceDest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/{lang}",
        viewSrc: "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/src",
        viewDest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/{lang}",
        destDir: "D:/Pakinguo_documents/My Github/js-module-builder/demo/front/_jsmb_/i18n",
        map: /\{lang\}/,
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
                src: "app/**/*.js",
                dest: "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource"
            }
        ]
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
            },
            map: [
                [/\{\$BASE\}/, "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/"]
            ]
        }
    }
})