const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  getLibraries: () => ipcRenderer.invoke('get-libraries'),
  saveLibrary: (groups) => ipcRenderer.invoke('save-library', groups),
  deleteLibrary: (groupName) => ipcRenderer.invoke('delete-library', { groupName }),
  saveExportedImage: (base64data, defaultName, sourcePath) => ipcRenderer.invoke('save-exported-image', base64data, defaultName, sourcePath)
});
