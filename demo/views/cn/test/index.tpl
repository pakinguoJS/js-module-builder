<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
    <!--<link rel="stylesheet" type="text/css" href="{$BASE}src/test/css/a.css" />-->
    <script src="/pakinguo/demo/resource/lib/seajs/sea.js"></script>
    <script src="/pakinguo/demo/resource/lib/seacss/seacss.js"></script>
    <script src="/pakinguo/demo/resource/conf/conf.js"></script>
</head>
<body>
<div class="test">test</div>
<div class="test1">test str_name</div>



<img src="../../../../static/img/001.jpg">
<script type="text/javascript">
    seajs.config({map:[["app/cn/test/js/index.js","app/cn/test/js/index.js?1448369164329"]]})
    seacss.config({map:[["static/css/test/a.css","static/css/test/a.css?1448369164440"],["static/css/test/b.css","static/css/test/b.css?1448369160030"]]})
    seacss.use(['static/css/test/a.css', 'static/css/test/b.css']);
    seajs.use('index');
</script>
</body>
</html>