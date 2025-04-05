const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 400,
    minHeight: 300,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    icon: path.join(__dirname, '../build/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Auto-updater setup (commented out for now)
  /*
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });

  autoUpdater.on('error', (error) => {
    mainWindow.webContents.send('update_error', error.message);
  });

  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 5000);
  */

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../build/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Vanguard Text', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Vanguard Text');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show());
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.handle('save-file', async (event, content) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save File',
    defaultPath: path.join(app.getPath('documents'), 'untitled.txt'),
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, content);
    return filePath;
  }
  return null;
});

ipcMain.handle('open-file', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Open File',
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });
  if (filePaths?.length > 0) {
    return fs.readFileSync(filePaths[0], 'utf-8');
  }
  return null;
});

ipcMain.handle('window-control', (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;
  switch (action) {
    case 'minimize': win.minimize(); break;
    case 'maximize': win.isMaximized() ? win.unmaximize() : win.maximize(); break;
    case 'close': win.close(); break;
  }
});