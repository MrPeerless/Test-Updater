const { app, BrowserWindow, ipcMain } = require('electron');
// Add autoUpdater
const { autoUpdater } = require('electron-updater');
// Add path and fs
const path = require("path");
const fs = require("fs");
// Main window variable
let win;

// Create the main window
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "./app/js/preload.js")
        },
    });

    // Open the DevTools.
    //win.webContents.openDevTools()

    win.loadFile('./app/index.html');
    win.on('closed', function () {
        win = null;
    });

    // Add check for updates
    autoUpdater.checkForUpdatesAndNotify();
}


app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});



/*
ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});
*/

// RECEIVE ALL MESSAGES FROM RENDERER
ipcMain.on('toMain', (event, message) => {
    console.log("message = " + message)
    var data = [];

    // CHECK WHICH MESSAGE RECEIVED
    // App Version
    if (message == "app_version") {
        // Return message handler
        data[0] = message;
        // Call function to get app version
        data[1] = appVersion();
        console.log("version = " + data[1])
        // Send data back to renderer
        win.webContents.send('fromMain', data);
    }

    // Restart App
    if (message == "restart_app") {
        autoUpdater.quitAndInstall();
    }
});

// FUNCTIONS TO RUN FROM IPC MESSAGES

// Function to get app version from package.json
function appVersion() {
    var version = app.getVersion();
    return version;
}

// Add autoUpdate event listeners
autoUpdater.on('update-available', () => {
    win.webContents.send('fromMain', 'update_available');
});
autoUpdater.on('update-downloaded', () => {
    win.webContents.send('fromMain', 'update_downloaded');
});










/*
// Install update event listener
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
*/


