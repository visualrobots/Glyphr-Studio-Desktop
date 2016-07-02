const electron = require('electron'),
      {app} = electron,
      {BrowserWindow} = electron,
      {ipcMain} = electron,
      open = require('open');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    icon: process.platform === 'linux' && __dirname + '/images/icon.png'
  });
  win.loadURL('file://' + __dirname + '/bower_components/glyphr-studio/dev/Glyphr_Studio_Autohacked_For_Electron.html');

  let webContents = win.webContents;

  //webContents.on('new-window', function(event, url){
  //  event.preventDefault();
  //  open(url);
  //});

   webContents.openDevTools()

  win.on('closed', function () {
    win = null;
  });
}

ipcMain.on('openPopOut', function(event, data) {
  let popOutWin = new BrowserWindow({
    width: 800,
    height: 800,
    title: 'Glyphr Studio - Canvas'
  });
  popOutWin.loadURL('file://' + __dirname + '/popOut.html');
  ipcMain.on('fuckingSecurityModel', function (event, data) {
    console.log(data.codeToExecute);
    popOutWin.webContents.executeJavaScript(data.codeToExecute);
  });

  popOutWin.on('closed', function() {
    popOutWin = null;
  });
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    //if (process.platform != 'darwin')
      app.quit();
});

app.on('activate', function () {
  if (win === null) {
    createWindow();
  }
});
