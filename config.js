/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path     = require('path'),
    extend   = require('extend'),
    config   = require('spa-plugin/config'),
    pkgData  = require(path.join(process.cwd(), 'package.json')),
    profiles = {},
    modules  = ['stb-app', 'stb-component'];


function preparePaths ( name ) {
    var paths = modules.map(function ( moduleName ) {
        return path.join(path.dirname(require.resolve(moduleName)), 'css', name + '.css');
    });

    paths.push(path.join(config.source, 'css', name + '.css'));

    return paths;
}


Object.keys(pkgData.dependencies || {}).concat(Object.keys(pkgData.devDependencies || {})).forEach(function ( name ) {
    if ( name.indexOf('stb-component-') === 0 ) {
        modules.push(name);
    }
});


// release
[480, 576, 720, 1080].forEach(function ( resolution ) {
    var taskName = 'release:' + resolution,
        fileName = 'release.' + resolution;

    profiles[taskName] = extend(true, {}, config, {
        // main entry point
        source: preparePaths(fileName),

        // intended output file
        target: path.join(config.target, 'css', fileName + '.css')
    });
});

// develop
[480, 576, 720, 1080].forEach(function ( resolution ) {
    var taskName = 'develop:' + resolution,
        fileName = 'develop.' + resolution;

    profiles[taskName] = extend(true, {}, config, {
        // main entry point
        source: preparePaths(fileName),

        // intended output file
        target: path.join(config.target, 'css', fileName + '.css')
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
