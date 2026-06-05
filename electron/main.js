const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getMachineId, verifyLicense, saveLicense, loadAndVerify } = require('./license.js');

function getLibRoot() {
  const drive = process.env.SystemDrive || 'C:';
  return path.join(drive, '\\', 'Color Reduction', 'Libraries');
}

function ensureLibFolders() {
  const libRoot = getLibRoot();
  if (!fs.existsSync(libRoot)) {
    fs.mkdirSync(libRoot, { recursive: true });
  }
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/app-icon.png')
  });

  // Prevent Electron from navigating when files are dragged onto the window
  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
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

// IPC: read a file by path (used for reliable drag-and-drop in Electron)
ipcMain.handle('read-file-path', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mimeMap = { bmp: 'image/bmp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
    const mime = mimeMap[ext] || 'image/png';
    return {
      name: path.basename(filePath),
      path: filePath,
      dataUrl: `data:${mime};base64,${base64}`
    };
  } catch (e) {
    return null;
  }
});

// IPC: open file dialog (so the file browse button works in Electron context)
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
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
    path: filePath,
    dataUrl: `data:${mime};base64,${base64}`
  };
});

ipcMain.handle('save-exported-image', async (event, base64data, defaultName, sourcePath) => {
  let defaultPath = defaultName;
  if (sourcePath) {
    const dir = path.dirname(sourcePath);
    defaultPath = path.join(dir, defaultName);
  }
  
  const result = await dialog.showSaveDialog({
    defaultPath: defaultPath,
    filters: [
      { name: 'Bitmap Image', extensions: ['bmp'] }
    ]
  });
  
  if (result.canceled || !result.filePath) return false;
  
  fs.writeFileSync(result.filePath, Buffer.from(base64data, 'base64'));
  return true;
});


// --- IPC: Library Management ---
ipcMain.handle('get-libraries', () => {
  ensureLibFolders();
  const library = [];
  const libRoot = getLibRoot();
  
  const items = fs.readdirSync(libRoot, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      const groupName = item.name;
      const groupPath = path.join(libRoot, groupName);
      const jsonPath = path.join(groupPath, 'colors.json');
      
      let colors = [];
      if (fs.existsSync(jsonPath)) {
        try {
          const content = fs.readFileSync(jsonPath, 'utf8');
          colors = JSON.parse(content);
        } catch (err) {
          console.error(`Failed to parse colors.json in ${groupName}`, err);
        }
      }
      
      library.push({
        id: Buffer.from(groupName).toString('base64').substring(0, 8),
        name: groupName,
        colors: colors
      });
    }
  }
  return library;
});

ipcMain.handle('save-library', (event, groups) => {
  ensureLibFolders();
  const libRoot = getLibRoot();
  // We expect 'groups' to be the full library array from the frontend.
  // We will sync it to the file system.
  
  // First, get existing folders to delete any removed groups
  const existingItems = fs.readdirSync(libRoot, { withFileTypes: true });
  const existingFolders = existingItems.filter(i => i.isDirectory()).map(i => i.name);
  
  const currentGroupNames = groups.map(g => g.name);
  
  // Delete folders that no longer exist in the library
  for (const folder of existingFolders) {
    if (!currentGroupNames.includes(folder)) {
      const folderPath = path.join(libRoot, folder);
      fs.rmSync(folderPath, { recursive: true, force: true });
    }
  }

  // Save each group
  for (const group of groups) {
    const safeName = group.name.replace(/[<>:"/\\|?*]/g, '_');
    const groupPath = path.join(libRoot, safeName);
    if (!fs.existsSync(groupPath)) {
      fs.mkdirSync(groupPath, { recursive: true });
    }
    const jsonPath = path.join(groupPath, 'colors.json');
    fs.writeFileSync(jsonPath, JSON.stringify(group.colors || [], null, 2), 'utf8');
  }
  return true;
});

// We can remove delete-library since save-library handles sync, or keep it for individual deletes.
ipcMain.handle('delete-library', (event, { groupName }) => {
  const libRoot = getLibRoot();
  const safeName = groupName.replace(/[<>:"/\\|?*]/g, '_');
  const folderPath = path.join(libRoot, safeName);
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    return true;
  }
  return false;
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
  ensureLibFolders();

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
