define(function(require, module, exports){
    require('./alert');
    require('test');
    require.async(['./a.js', './b.js'], function(a, b){})
})