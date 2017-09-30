const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const devMode = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const nick = {
  value: 3,
};

function createWindow () {
  // Create the browser window.
  const width = 503;
  const height = 188;

  const mainScreen = electron.screen.getPrimaryDisplay();
  const screenWidth = mainScreen.size.width;
  const screenHeight = mainScreen.size.height;

  mainWindow = new BrowserWindow({
    width,
    height,
    x: parseInt((screenWidth - width) / 2, 10), // x and y need to be integers
    y: parseInt(screenHeight - height, 10),
    frame: false,
    center: false,
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // make sure the windows is always on top
  setInterval(() => mainWindow.setAlwaysOnTop(true), 5000);

  // Open the DevTools.
  if (devMode) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
