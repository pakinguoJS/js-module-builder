# JS Module Builder #
By pakinguo on 12/7/2015
<br>
<br>
<br>

## 编译器提供的功能 ##


- 同buildjs，从src（源文件夹）分别同步到resource和views下的src；
翻译功能，提取为xml文件；
- JS、CSS合并压缩，以配置文件方式来指定要对哪些文件进行合并，代替之前的自动检索（自动检索的问题在于有些并不需要合并或压缩文件也会被自动检索为需要压缩合并）；
- 文件版本控制，支持图片、<link css>方式、seajs.use()的cmd方式、seacss.use()的css引入方式，生成的图片及link css方式会直接替换引用的链接（加文件修改时间后缀），而对于use的方式则引入“//@version cmd ”和“//@version css”正则替换方式进行模块映射，附带上版本号；
- 可清除指定的文件夹（如清空编译后的所有文件等）
- 提供JS文档自动化生成工具(仅在linux下)，文档语法参考 https://github.com/senchalabs/jsduck/wiki 。

<br>
<br>


## 新版安装方式 ##
Step0：安装node环境

Step1：将代码部署到指定的环境（如开发或测试环境）

Step2：修改部署的文件夹下的bin/init.sh权限，使其可执行，执行后即可用相关命令了

<br>
<br>

## 命令使用方式 ##
    jsmb init
> 初始化编译器的配置文件，默认生成的文件路径为当前路径+”_jsmb_/jsmb.conf.js”。

<br>

    jsmb watch [confPath]
> 对当前路径开启实时文件监听（Linux下建议使用jsmb-start），参数confPath可制定配置文件的路径，默认为当前路径下的_jsmb_/jsmb.conf.js。

<br>

    jsmb xgettext [confPath]
> 提取待翻译的字段，[lang]支持多语言，不同语言间用", "隔开。

<br>

	jsmb gettext [confPath]
> 根据指定语言类型翻译已提取的字段，[lang]同xgettext。

<br>

	jsmb release [confPath]
> 根据配置文件制定的编译功能进行全局编译。

<br>

	jsmb clean [confPath]
> 清除制定的文件（夹）。

<br>

    jsmb doc [src] [distribution]
> JS文档自动化生成，src指定自动化检索的源文件夹，distribution指定生成后的文档路径。

<br>
<br>


## Linux下额外提供命令 ##
    jsmb-start
> 对当前路径开启后台进程实时文件监听（同步文件），若不存在配置文件，则会报错，默认配置文件为当前路径下的_jsmb_/jsmb.conf.js。

<br>

    jsmb-stop
> 对当前路径关闭后台实时监听进程。

<br>
<br>


## 配置文件 ##

所有命令通过配置文件来指定相关操作，具体看参数说明：

	{
	    "src": "./",                    // 开发源代码目录
	    "dest": "../resource",          // 编译生成的静态文件目录
	    "view": "../views/src",         // 编译生成的view层文件目录
	
	    // 实时文件监听并同步翻译某种语言（可默认设置en或者其他目录，如：dist等）
	    "realtimeI18n": {
	        type: "xml",
	        xgettextSrc: "./app/src",                   // 需要提取翻译字段的源路径
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
	        xgettextSrc: "./app/src",                   // 需要提取翻译字段的源路径
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
	
	    // seajs transport，配置与grunt-cmd-transport一致
	    "transport": {
	        files: [
	            {
	                expand: true,
	                cwd: "",
	                src: "",
	                dest: ""
	            }
	        ]
	    },
	
	    // js uglify
	    "uglifyjs": {
	        vars: {                 // 变量参数，指定lang和map，对应i18n的langList
	            lang: ["en"],
	            map: /\{lang\}/
	        },
	        // 文件前缀路径，与files下的 src 合并成全路径，也可以在files下每个元素中设置
	        cwd: "",
	        files: [
	            {
	                "cwd": "", // 不填写则默认使用上一层cwd字段的值
	                "dest": "",
	                "src": []
	            }
	        ]
	    },
	
	    // css minify, 所有配置同uglify
	    "minifycss": {
	        vars: {
	            lang: ["en"],
	            map: /\{lang\}/
	        },
	        cwd: "",
	        files: [
	            {
	                "cwd": "", // 不填写则默认使用上一层cwd字段的值
	                "dest": "",
	                "src": []
	            },
	            {
	                "dest": "",
	                "src": []
	            }
	        ]
	    },
	
	    // 版本号控制
	    "version": {
	        type: "time",               // 版本号类型，目前只支持time，还提供md5，但md5效率比较低
	        exclude: /\/lib\/|\/src\//, // 除去不需要添加版本号的文件（夹）
	        vars: {                     // 同uglify
	            lang: ["en"],
	            map: /\{lang\}/
	        },
	        // 指定需要设置版本号的文件夹路径
	        src: [],
	        options: {
	            // 同transport的alias配置，配合vars中的map根据不同语言处理不同的
	            alias: {},
	            // 主要是替换link和script标签中存在的变量
	            map: []
	        }
	    },
	
	    // 清除编译后生成的文件
	    "clean": {
	        files: [
	            "../resource",
	            "../views",
	            "_jsmb_/rsync.time"
	        ]
	    }
	}
