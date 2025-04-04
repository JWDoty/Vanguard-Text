document.addEventListener('DOMContentLoaded', () => {
  // Version display
  window.electronAPI.getVersion().then((data) => {
    document.getElementById('version').textContent = `v${data.version}`;
  });

  // Update handlers
  window.electronAPI.onUpdateAvailable(() => {
    console.log('Update available - downloading...');
  });

  window.electronAPI.onUpdateDownloaded(() => {
    if(confirm('Update downloaded. Restart now to install?')) {
      window.electronAPI.restartApp();
    }
  });
});