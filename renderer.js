const {dialog} = require('electron').remote,
      fs = require('fs'),
      path = require('path'),
      ipcRenderer = require('electron').ipcRenderer;

window.addEventListener('beforeunload', function (event) {
  window.onbeforeunload = confirmClose();
});

function confirmClose(event) {
  var confirm;
  
  if (document.getElementById('splashscreenlogo')) {
    return;
  }
  
  confirm = dialog.showMessageBox({
    type: 'question',
    title: 'Confirm',
    buttons: ['Yes', 'No', 'Cancel'],
    message: 'Would you like to save before closing?'
  });
  
  if (confirm === 0) {
    saveGlyphrProjectFile();
  }
  if (confirm === 2) {
    event.preventDefault;
  }
}

saveFile = function(fname, buffer) {
  destination = dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Choose where to save project...',
    defaultPath: process.env.HOME
  }); 
  if (destination !== undefined) {
    fs.writeFile(destination + '/' + fname, buffer);
  }
  else {
    event.returnValue('Stay Open');
  }
};

popOut = function(){
  var newWindow = '<!doctype html>\n'+
                  '<html>\n'+
                    '  <head>\n'+
                      '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n'+
                      '    <link rel="stylesheet" type="text/css" href="bower_components/glyphr-studio/dev/Glyphr_Studio.css" />\n'+
                      '    <title>Glyphr Studio - Canvas</title>\n'+
                    '  </head>\n'+
                    '  <body>\n'+
                      '    <span id="toast"></span>\n'+
                      '    <div id="secondaryScreenLayout"></div>\n'+
                      '    <div id="mainwrapper"></div>\n'+
                    '  </body>\n'+
                    '  <script src="popOut.js"></script>\n'+
                  '</html>';
  
  fs.writeFileSync('popOut.html', newWindow);
  
  var newPath = path.join(__dirname, 'popOut.html');
  
  _UI.popout = window.open(newPath, 'Glypher Studio - Tools');

  //Main Window
  document.title = 'Glyphr Studio - Tools';
  console.log(document.body.classList);
  document.body.classList.add('poppedOut');
  
  navigate();

  //Canvas Window
  _UI.popout.document.head.appendChild(document.styleSheets[0].ownerNode.cloneNode(true));
  _UI.popout.onBeforeUnload = popIn;
  _UI.popout.document.getElementById('mainwrapper').style.overflowY = 'hidden';

  for(var f in window){ if(window.hasOwnProperty(f) && !_UI.popout[f]){
      _UI.popout[f] = window[f];
  }}

  getEditDocument().addEventListener('keypress', keypress, false);
  getEditDocument().addEventListener('keydown', keypress, false);
  getEditDocument().addEventListener('keyup', keyup, false);

  //navigate();
};