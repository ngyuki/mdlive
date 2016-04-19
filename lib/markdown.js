var marked = require('marked');
var hljs = require('highlight.js');

function parse(input)
{
    return marked(input, {
        highlight: function (code, lang) {
            return hljs.highlightAuto(code, [lang]).value;
        }
    });
}

module.exports = parse;
