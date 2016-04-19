import marked from 'marked';
import hljs from 'highlight.js';

export default function(input){
    return marked(input, {
        highlight: function (code, lang) {
            return hljs.highlightAuto(code, [lang]).value;
        }
    });
};
