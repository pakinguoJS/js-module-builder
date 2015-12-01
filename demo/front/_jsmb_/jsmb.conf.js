jsmb.set({
    "src": "./",                    // 开发源代码目录
    "dest": "../resource",          // 编译生成的静态文件目录
    "view": "../views/src",         // 编译生成的view层文件目录

    // 实时文件监听并同步翻译某种语言（可默认设置en或者其他目录，如：dist等）
    "realtimeI18n": {
        type: "xml",
        xgettextSrc: "app/src",                     // 需要提取翻译字段的源路径
        resourceSrc: "../resource/app/src",         // 翻译的静态资源源模板的路径
        resourceDest: "../resource/app/{lang}",     // 翻译后的静态资源目标路径
        viewSrc: "../views/src",                    // 翻译的页面资源源模板的路径
        viewDest: "../views/{lang}",                // 翻译后的页面资源目标路径
        destDir: "_jsmb_/i18n",                     // 存放提取的翻译字段文件的文件夹
        map: /\{lang\}/,                            // 如果目标路径中存在需要替换的路径，则需要map指定替换的字符串
        langList: {                                 // 需要翻译的语言类型，字段为编译后生成的文件夹名，值为翻译提取的文件路径，需要跟destDir合成
            "en": "./xml/en/all.xml"
        }
    },

    // 翻译配置
    "i18n": {
        type: "xml",
        xgettextSrc: "app/src",                     // 需要提取翻译字段的源路径
        resourceSrc: "../resource/app/src",         // 翻译的静态资源源模板的路径
        resourceDest: "../resource/app/{lang}",     // 翻译后的静态资源目标路径
        viewSrc: "../views/src",                    // 翻译的页面资源源模板的路径
        viewDest: "../views/{lang}",                // 翻译后的页面资源目标路径
        destDir: "_jsmb_/i18n",                     // 存放提取的翻译字段文件的文件夹
        map: /\{lang\}/,                            // 如果目标路径中存在需要替换的路径，则需要map指定替换的字符串
        langList: {                                 // 需要翻译的语言类型，字段为编译后生成的文件夹名，值为翻译提取的文件路径，需要跟destDir合成
            "en": "./xml/en/all.xml",
            "cn": "./xml/cn/all.xml"
        }
    },

    // seajs transport，配置与grunt-cmd-transport一致
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

    // js uglify
    "uglifyjs": {
        vars: {                 // 变量参数，指定lang和map，对应i18n的langList
            lang: ["en", "cn"],
            map: /\{lang\}/
        },
        // 文件前缀路径，与files下的 src 合并成全路径，也可以在files下每个元素中设置
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

    // css minify, 所有配置同uglify
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

    // 版本号控制
    "version": {
        type: "time",               // 版本号类型，目前只支持time，还提供md5，但md5效率比较低
        exclude: /\/lib\/|\/src\//, // 除去不需要添加版本号的文件（夹）
        vars: {                     // 同uglify
            lang: ["en", "cn"],
            map: /\{lang\}/
        },
        // 指定需要设置版本号的文件夹路径
        src: [
            "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/app/{lang}",
            "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/static",
            "D:/Pakinguo_documents/My Github/js-module-builder/demo/views/{lang}"
        ],
        options: {
            // 同transport的alias配置，配合vars中的map根据不同语言处理不同的
            alias: {
                "index": "app/{lang}/test/js/index.js"
            },
            // 主要是替换link和script标签中存在的变量
            map: [
                [/\{\$BASE\}/, "D:/Pakinguo_documents/My Github/js-module-builder/demo/resource/"]
            ]
        }
    },

    // 清除编译后生成的文件
    "clean": {
        files: [
            "../resource",
            "../views",
            "_jsmb_/rsync.time"
        ]
    },

    // 打包
    "pack": {
        src: [
            "../resource",
            "../views"
        ],
        destDir: "_jsmb_/pack"
    }
})