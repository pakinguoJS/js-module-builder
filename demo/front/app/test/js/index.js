define(function(require, module, exports){
    require('./alert.js');
    require.async(['./a.js', './b.js'], function(a, b){})
})