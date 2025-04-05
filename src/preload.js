const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (content) => ipcRenderer.invoke('save-file', content),
  openFile: () => ipcRenderer.invoke('open-file'),
  windowControl: (action) => ipcRenderer.invoke('window-control', action),
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  onUpdateError: (callback) => ipcRenderer.on('update_error', callback),
  restartApp: () => ipcRenderer.send('restart_app'),
  getVersion: () => ipcRenderer.invoke('app_version')
});