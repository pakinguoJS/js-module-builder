var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var sync = require('./../node_modules/jsb-sync/sync.js').dsync;

var cwd = process.cwd();
var src = cwd.replace(/\\/g, "/");
var dst = path.join(path.dirname(cwd), 'dst').replace(/\\/g, "/");

var log = console.log;

var watcher = chokidar.watch(cwd, {
    persistent: true,

    ignored: false,
    ignoreInitial: false,
    followSymlinks: true,
    cwd: '.',

    usePolling: true,
    alwaysStat: false,
    depth: undefined,
    interval: 1000,

    ignorePermissionErrors: false,
    atomic: true
});

watcher
    .on('add', function (file) {
        var filename = path.join(cwd, file).replace(/\\/g, "/");
        sync(filename, filename.replace(src, dst));
        log('File', filename, 'has been added');
    })
    .on('change', function (file) {
        var filename = path.join(cwd, file).replace(/\\/g, "/");
        sync(filename, filename.replace(src, dst));
        log('File', filename, 'has been changed');
    })
    .on('unlink', function (file) {
        var filename = path.join(cwd, file).replace(/\\/g, "/");
        sync(filename, filename.replace(src, dst));
        log('File', filename, 'has been removed');
    })
    // More events.
    .on('addDir', function (file) {
        var filename = path.join(cwd, file).replace(/\\/g, "/");
        sync(filename, filename.replace(src, dst));
        log('Directory', filename, 'has been added');
    })
    .on('unlinkDir', function (file) {
        var filename = path.join(cwd, file).replace(/\\/g, "/");
        sync(filename, filename.replace(src, dst));
        log('Directory',filename, 'has been removed');
    })
    .on('error', function (error) {
        log('Error happened', error);
    })
    .on('ready', function () {
        log('Initial scan complete. Ready for changes.');
    })
    .on('raw', function (event, file, details) {
        //log('Raw event info:', event, file, details);
    });


function sync(src) {

}