// Get element to display version number
const version = document.getElementById('version');

// Variables to display notifications for auto update
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

// SEND REQUEST FOR VERSION FROM main.js
window.api.send("toMain", "app_version");

// RECEIVE ALL MESSAGES FROM MAIN
window.api.receive('fromMain', (data) => {
    // CHECK WHICH MESSAGE RECEIVED
    console.log("Message data[0] = " + data[0])
    console.log("Message data = " + data)

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
});

// App version function to display version
function appVersion(data) {
    version.innerText = 'Version ' + data;
}

// Function to close notification box
function closeNotification() {
    notification.classList.add('hidden');
}

// Function to restart app
function restartApp() {
    window.api.send("toMain", "restart_app");
}





/*
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

// Functions to close and restart update
function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}
*/
