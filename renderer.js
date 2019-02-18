const hook = require('node-hook');
const pugVDOM = require('pug-vdom');
const postcss = require('postcss');
const path = require('path');
const defaults = require('defaults-es6');
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

// hook.hook('.js', function(source, filename) {
//     if (path.parse(filename).name === 'subsonic-interface') {
//         console.log(eval(source))
//     }

//     return source;
// });

var App = require('./gsonic/node_modules/weddell').classes.App;

var app = new App({
    routes: require('./gsonic/src/scripts/routes'),
    el: '#app',
    Component: Component => class extends require('./gsonic/src/components/root')(Component) {
        static get SubsonicMusicLibraryInterface() {
            console.log("extending interface");
            return super.SubsonicMusicLibraryInterface;
        }

        static get components() {
            return defaults({
                'player': Component => class extends super.components.player(Component) {
                    
                }
            }, super.components);
        }
    },
    renderInterval: 16.667
});

// var app = require('./gsonic');

// app.on('patch', () => {
//     console.log('patched gsonic');
// })

app.init({initialPath: '/'});