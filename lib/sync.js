var fs = require('fs');
var path = require('path');

module.exports = (function(){

    function sync(src, dst){

        // ���Դ�ļ������ڣ�����Ҫ�ж϶�Ӧͬ�����ļ�ͬ��ɾ��
        if(!fs.existsSync(src)){
            if(fs.existsSync(dst)){
                var fileStat = fs.statSync(dst);
                if(fileStat.isDirectory()){
                    try{
                        fs.rmdirSync(dst);
                    }catch(e){}
                }else{
                    fs.unlinkSync(dst);

                    // ������ļ�����ҪУ���䵱ǰ�ļ����Ƿ���ڣ���������ڣ�����Ҫ����ɾ��
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

        // �ļ��к��ļ����ָ���
        if(fs.statSync(src).isDirectory()){
            mkdir(dst);
        }else{
            // ��֤����ǰ�ļ��д���
            mkdir(path.dirname(dst));
            // �����ļ�
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

