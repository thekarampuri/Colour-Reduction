const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getMachineId, verifyLicense, saveLicense, loadAndVerify } = require('./license.js');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/app-icon.png')
  });

  // Load the original HTML file directly — most reliable approach
  mainWindow.loadFile(path.join(__dirname, '../ColorReduction (8).html'));
  // mainWindow.webContents.openDevTools();
}

let activationWindow = null;

function createActivationWindow() {
  activationWindow = new BrowserWindow({
    width: 500,
    height: 450,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../assets/app-icon.png')
  });

  activationWindow.loadFile(path.join(__dirname, 'activation.html'));
}

// IPC: open file dialog (so the file browse button works in Electron context)
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['bmp', 'png', 'jpg', 'jpeg', 'gif', 'webp'] }
    ]
  });
  if (result.canceled || !result.filePaths.length) return null;
  const filePath = result.filePaths[0];
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mimeMap = { bmp: 'image/bmp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
  const mime = mimeMap[ext] || 'image/png';
  return {
    name: path.basename(filePath),
    dataUrl: `data:${mime};base64,${base64}`
  };
});

ipcMain.handle('get-machine-id', () => {
  return getMachineId();
});

ipcMain.handle('verify-license', (event, key) => {
  const id = getMachineId();
  if (verifyLicense(id, key)) {
    saveLicense(id, key);
    createWindow();
    if (activationWindow) {
      activationWindow.close();
      activationWindow = null;
    }
    return true;
  }
  return false;
});

app.whenReady().then(() => {
  if (loadAndVerify()) {
    createWindow();
  } else {
    createActivationWindow();
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (loadAndVerify()) createWindow();
      else createActivationWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
