// Require modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const shell = require('electron').shell;

// Add autoUpdater
const { autoUpdater } = require('electron-updater');

// Add path and fs
const path = require("path");
const fs = require("fs");

// Read variables from resources file in root dir.
const { readFileSync } = require('fs'); // To read json files
var resources = JSON.parse(readFileSync('./resources.json'));

console.log("First Name = " + resources.firstName)
console.log("Surname = " + resources.surname)

// Main window variable
let win;

// Create the main window
function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "./app/js/preload.js")
        },
    });

    // Open the DevTools.
    win.webContents.openDevTools()

    win.loadFile('./app/index.html');

    win.on('closed', function () {
        win = null;
    });    
}

app.on('ready', () => {
    createWindow();
    // Add check for updates
    autoUpdater.checkForUpdatesAndNotify();
    
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

// RECEIVE ALL MESSAGES FROM RENDERER
ipcMain.on('toMain', (event, message) => {
    // CHECK WHICH MESSAGE RECEIVED
    // App Version
    if (message == "app_version") {
        appVersion(message);
    }

    // Restart App
    if (message == "restart_app") {
        autoUpdater.quitAndInstall();
    }

    // Open dialog box
    if (message[0] == "open_dialog") {
        openDialog(message);
    }

    // Get file modified date
    if (message[0] == "modified_date") {
        modifiedDate(message);
    }

    // Open external URL
    if (message[0] == "open_external") {
        shell.openExternal(message[1]);
    }
});

// App Path listener and sender
ipcMain.on("toApp_path", (event) => {
    var data = app.getPath('userData');
    console.log("Main App path = " + data)
    event.sender.send("fromApp_path", data);
});

// Path resolve listener and sender
ipcMain.on("toPath_resolve", (event, message) => {
    var data = (path.resolve(__dirname + message));
    console.log("Resolve path = " + data)
    event.sender.send("fromPath_resolve", data);
});



// FUNCTIONS TO RUN FROM IPC MESSAGES

// Function to get app version from package.json
function appVersion(message) {
    var data = [];
    data[0] = message;
    data[1] = app.getVersion();
    win.webContents.send('fromMain', data);
}

// Function to get modified date
function modifiedDate(message) {
    // Data to return message to renderer
    var data = [];
    data[0] = message[0];
    data[1] = fs.statSync(message[1]).mtime
    console.log("data = " + data)
    win.webContents.send('fromMain', data);
}

// Function to open dialog box to select directory
function openDialog(message) {
    // Data to return message to renderer
    var data = [];
    // Options to display on dialog box
    var options = { title: message[1], defaultPath: message[2], buttonLabel: message[3], properties: [message[4]] }

    // Open dialog box to browse directory
    dialog.showOpenDialog(win, options).then(result => {
        // Set message data to retun to renderer
        data[0] = message[0];
        data[1] = result.filePaths;
        // Send message back to renderer with data result
        win.webContents.send('fromMain', data);
    }).catch(err => {
        console.log(err)
    });
}    

// AutoUpdate event listeners
autoUpdater.on('update-available', () => {
    win.webContents.send('fromMain', 'update_available');
});
autoUpdater.on('update-downloaded', () => {
    win.webContents.send('fromMain', 'update_downloaded');
});











