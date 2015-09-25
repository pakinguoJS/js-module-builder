var fs = require('fs');
var path = require('path');

module.exports = (function(){

    function sync(src, dst){

        // 如果源文件不存在，则需要判断对应同步的文件同步删除
        if(!fs.existsSync(src)){
            if(fs.existsSync(dst)){
                var fileStat = fs.statSync(dst);
                if(fileStat.isDirectory()){
                    try{
                        fs.rmdirSync(dst);
                    }catch(e){}
                }else{
                    fs.unlinkSync(dst);

                    // 如果是文件，需要校验其当前文件夹是否存在，如果不存在，则需要尝试删除
                    if(!fs.existsSync(path.dirname(src))){
                        var list = fs.readdirSync(path.dirname(dst));
                        if(list.length === 0){
                            fs.rmdirSync(path.dirname(dst));
                        }
                    }
                }
            }
            return;
        }

        // 文件夹和文件区分复制
        if(fs.statSync(src).isDirectory()){
            mkdir(dst);
        }else{
            // 保证复制前文件夹存在
            mkdir(path.dirname(dst));
            // 复制文件
            fs.writeFileSync(dst, fs.readFileSync(src));
        }

    }

    function mkdir(dst){
        if(!fs.existsSync(dst)){
            console.log(dst)
            mkdir(path.dirname(dst));
            fs.mkdirSync(dst);
        }
    }

    return sync;
})();

