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
  
  var div = document.createElement('div');
  div.appendChild(document.styleSheets[0].ownerNode.cloneNode(true));
  var cssLine = div.innerHTML;
  
  var popOutScript = '';
  
  var newEntriesArray = findNewEntries();
  // TODO: Technique fails to screen out anonymous functions (native electron calls)
  for(var f in window) { 
    if (window.hasOwnProperty(f) && !_UI.popout[f] && newEntriesArray.indexOf(f) > -1) {
      if (typeof window[f] === 'function') {
        popOutScript += window[f].toString()+'\n';
      }
      else if (typeof window[f] === 'object') {
        try {
          if (window[f]) {
            popOutScript += 'var ' + f + '=' + JSON.stringify(window[f]) + ';'+'\n';
          }
        }
        catch(e) {
          //Fuck errors, we're doing nothing with this
        }
      }
      else {
        if (typeof window[f] === 'string' && !window[f]) {
          popOutScript += 'var ' + f + '=' + '""' + ';'+'\n';
        }
        else {
          popOutScript += 'var ' + f + '=' + window[f] + ';'+'\n';
        }
      }
    }
  }
  
  popOutScript += 'window.onBeforeUnload = popIn;\n'+
                  'document.getElementById(\'mainwrapper\').style.overflowY = \'hidden\';\n'+
                  'document.addEventListener(\'keypress\', keypress, false);\n'+
                  'document.addEventListener(\'keydown\', keypress, false);\n'+
                  'document.addEventListener(\'keyup\', keyup, false)';
  
  var newWindow = '<!doctype html>\n'+
                  '<html>\n'+
                    '  <head>\n'+
                      '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n'+
                      '    <link rel="stylesheet" type="text/css" href="Glyphr_Studio.css" />\n'+
                      '    <title>Glyphr Studio - Canvas</title>\n'+
                    '  </head>\n'+
                    '  <body>\n'+
                      '    <span id="toast"></span>\n'+
                      '    <div id="secondaryScreenLayout"></div>\n'+
                      '    <div id="mainwrapper"></div>\n'+
                    '  </body>\n'+
                    '  <script src="popOut.js"></script>\n'+
                  '</html>';
  
  
  fs.writeFileSync('popOut.js', popOutScript);
  fs.writeFileSync('popOut.html', newWindow);
  
  var newPath = path.join(__dirname, 'popOut.html');
  
  _UI.popout = window.open(newPath);

  //Main Window
  document.title = 'Glyphr Studio - Tools';
  document.body.classList.add('poppedOut');
  
  navigate();
};