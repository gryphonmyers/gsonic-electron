// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const hook = require('node-hook');
const pugVDOM = require('pug-vdom');
const postcss = require('postcss');
var cssnext = require("postcss-cssnext");

hook.hook('.css', function(source, filename){
    return `module.exports = \`${postcss([cssnext()]).process(source).css}\``;
});

hook.hook('.pug', function(source, filename){
    var result = "require('pug-vdom/runtime');\r\n module.exports = ";
    var ast = pugVDOM.ast(filename, __dirname, {});
    var func = 'function(locals, h){' + new pugVDOM.Compiler(ast).compile().toString() + 'return render(locals, h);}';
    result += func.toString();
    return result;
});

var app = require('./gsonic');

app.on('patch', () => {
    console.log('patched gsonic');
})

app.init({initialPath: '/'});