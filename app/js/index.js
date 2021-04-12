// Get elements to display
const version = document.getElementById('version');
const filepath = document.getElementById('filepath');
const sampleImage = document.getElementById('sampleImage');
const openLink = document.getElementById('openLink');

// Variables to display notifications for auto update
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

// Test source file for fs operations
//var MUSIC_PATH = "C:/Users/geoff/Music/Crooked Still/Friends of Fall"
//var sourceFile = MUSIC_PATH + "/folder.jpg";
//sampleImage.src = sourceFile;

// Get App path
var app_path;
var DB_PATH;
window.api.send("toApp_path");

window.api.receive('fromApp_path', (data) => {
    console.log("App path = " + data)
    app_path = data
});

// Resolve Path
var folder_path;
window.api.send("toPath_resolve", "/app/graphics/folder.jpg");

window.api.receive('fromPath_resolve', (data) => {
    console.log("Path = " + data)
    folder_path = data
    displayArt()
});

function displayArt() {
    sampleImage.src = folder_path;
}



// Send message to get modified date of sourceFile
//window.api.send("toMain", ["modified_date", folder_path])

// SEND REQUEST FOR VERSION FROM main.js
//window.api.send("toMain", "app_version");

// RECEIVE ALL MESSAGES FROM MAIN
window.api.receive('fromMain', (data) => {
    console.log("data = ", data)
    // CHECK WHICH MESSAGE RECEIVED
    // App version
    if (data[0] == "app_version") {
        appVersion(data[1])
    }

    // Update Available
    if (data == "update_available") {
        message.innerText = 'A new update is available. Downloading now...';
        notification.classList.remove('hidden');
    }

    // Update Downloaded
    if (data == "update_downloaded") {
        message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
        restartButton.classList.remove('hidden');
        notification.classList.remove('hidden');
    }

    // Open Dialog
    if (data[0] == "open_dialog") {
        displayFilepath(data[1])
    }

    // Modified Date
    if (data[0] == "modified_date") {
        console.log("Modified date = " + data[1])
    }
});

// App version function to display version
function appVersion(data) {
    version.innerText = 'Version ' + data;
}

// Display filepath selected
function displayFilepath(data) {
    filepath.innerText = "File path: " + data;
}

// Function to close notification box
function closeNotification() {
    notification.classList.add('hidden');
}

// Function to restart app
function restartApp() {
    window.api.send("toMain", "restart_app");
}

// Click event for settimgs browse button
document.getElementById('btnMusicDirectory').onclick = function (event) {
    event.preventDefault();
    // Send message to main to open dialog box
    window.api.send("toMain", ["open_dialog", "Select Your Music Directory", "C:\\", "Select Folder", "openDirectory"]);
}

// Open external wikipedia link using electron.shell (now in the main function)
document.getElementById('openLink').onclick = function (event) {
    event.preventDefault();
    window.api.send("toMain", ["open_external", document.getElementById('openLink').href]);

}


