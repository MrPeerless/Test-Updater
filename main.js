const { app, BrowserWindow, ipcMain } = require('electron');
// Add autoUpdater
const { autoUpdater } = require('electron-updater');
let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Add check for updates
    //mainWindow.once('ready-to-show', () => {
    //    autoUpdater.checkForUpdatesAndNotify();
    //});
}

app.on("ready", () => {
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});
/*
// Add autoUpdate event listeners
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

// Install update event listener
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
*/