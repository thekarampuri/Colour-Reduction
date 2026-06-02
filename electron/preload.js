const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  readFilePath: (filePath) => ipcRenderer.invoke('read-file-path', filePath),
  getLibraries: () => ipcRenderer.invoke('get-libraries'),
  saveLibrary: (groups) => ipcRenderer.invoke('save-library', groups),
  deleteLibrary: (groupName) => ipcRenderer.invoke('delete-library', { groupName }),
  saveExportedImage: (base64data, defaultName, sourcePath) => ipcRenderer.invoke('save-exported-image', base64data, defaultName, sourcePath)
});

// window.license — used by initActivationGate() in the HTML
contextBridge.exposeInMainWorld('license', {
  getInfo: async () => {
    const machineId = await ipcRenderer.invoke('get-machine-id');
    // The main process only creates the window after license verification,
    // so if we're here the license is already valid.
    return { machineId, licensed: true };
  },
  validate: (key) => ipcRenderer.invoke('verify-license', key)
});
