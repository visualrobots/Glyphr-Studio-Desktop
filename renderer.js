const {dialog} = require('electron').remote,
      fs = require('fs'),
      ipcRenderer = require('electron').ipcRenderer,
      path = require('path');

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

popOut = function() {
  var newPath = path.join(__dirname, 'popOut.html');

  console.log(_UI.popout);

  _UI.popout = true;

  ipcRenderer.send('openPopOut');

  console.log(_UI.popout);

  //Main Window
  document.title = 'Glyphr Studio - Tools';
  document.body.classList.add('poppedOut');

  navigate();
}

getEditDocument = function(codeToExecute) {
  codeToExecute = 'document.' + codeToExecute;
  if(_UI.popout){
    ipcRenderer.send('fuckingSecurityModel', {
      codeToExecute: codeToExecute
    });
    //return _UI.popout.document
  } else {
    //return document;
    eval(codeToExecute);
  }
}
