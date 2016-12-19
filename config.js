/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs       = require('fs'),
    path     = require('path'),
    extend   = require('extend'),
    config   = require('spa-plugin/config'),
    pkgData  = require(path.join(process.cwd(), 'package.json')),
    profiles = {},
    modules  = ['stb-app'/*, 'stb-component'*/];


function preparePaths ( mode, resolution ) {
    var name = mode + '.' + resolution;

    return modules.map(function ( moduleName ) {
        // default resolution-dependent file

        var fileName = path.join(process.cwd(), 'node_modules', moduleName, 'css', name + '.css');

        if ( !fs.existsSync(fileName) ) {
            // resolution-independent fallback
            fileName = path.join(process.cwd(), 'node_modules', moduleName, 'css', mode + '.css');
        }

        return fileName;
    });
}


Object.keys(pkgData.dependencies || {}).concat(Object.keys(pkgData.devDependencies || {})).forEach(function ( name ) {
    //if ( name.indexOf('stb-component-') === 0 ) {
    if ( name.indexOf('-component-') !== -1 ) {
        modules.push(name);
    }
});


['release', 'develop'].forEach(function ( mode ) {
    [480, 576, 720, 1080].forEach(function ( resolution ) {
        profiles[mode + ':' + resolution] = extend(true, {}, config, {
            // main entry point
            source: preparePaths(mode, resolution),

            // intended output file
            target: path.join(config.target, 'css', mode + '.sdk.' + resolution + '.css')
        });
    });
});


// watch all source files
Object.keys(profiles).forEach(function ( name ) {
    profiles[name].watch = profiles[name].source.map(function ( file ) {
        return file.slice(0, -3) + '*';
    });
});


// public
module.exports = profiles;
