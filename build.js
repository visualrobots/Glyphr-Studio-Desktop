const fs = require('fs');

var html,
    injectScript,
    htmlPath = 'bower_components/glyphr-studio/dev/Glyphr_Studio.html',
    autoHackPath = 'bower_components/glyphr-studio/dev/Glyphr_Studio_Autohacked_For_Electron.html';

html = fs.readFileSync(htmlPath).toString();
injectInit = html.replace('<link rel="icon"', '<script src="..\/..\/..\/init.js"><\/script>\n<link rel="icon"')
injectScript = injectInit.replace('<\/body>', '<script>require(\'..\/..\/..\/renderer.js\')<\/script>\n<\/body>');
fs.writeFileSync(autoHackPath, injectScript);