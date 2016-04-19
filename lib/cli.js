#!/usr/bin/env node

var sys = require('util');
var fs = require('fs');
var path = require('path');

if (process.argv.length < 3) {
    console.log(sys.format('Usage: %s <markdown file>', path.basename(process.argv[1])));
    process.exit(1);
}

var filename = path.resolve(process.argv[2]);
var basename = path.basename(filename);
var port = 25485

process.chdir(path.dirname(filename));

function readAndPushMarkdown()
{
    console.log('markdown', filename);
    fs.readFile(filename, function(err, data){
        if (err) {
            throw err;
        }
        var html = require('./markdown')(data.toString());
        io.sockets.emit('markdown', {
            title: basename,
            body: html,
        });
    });
}

var io = require('./server')(port, readAndPushMarkdown);

var open = require('open');
open('http://localhost:' + port);

require('./watch')(filename, readAndPushMarkdown);
