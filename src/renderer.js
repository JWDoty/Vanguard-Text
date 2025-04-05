document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const fontSelect = document.getElementById('font-select');
  const fontColor = document.getElementById('font-color');
  const opacitySlider = document.getElementById('opacity-slider');
  const newBtn = document.getElementById('new-btn');
  const openBtn = document.getElementById('open-btn');
  const saveBtn = document.getElementById('save-btn');
  const minimizeBtn = document.getElementById('minimize-btn');
  const maximizeBtn = document.getElementById('maximize-btn');
  const closeBtn = document.getElementById('close-btn');
  const versionSpan = document.getElementById('version');
  const notepadContainer = document.querySelector('.notepad-container');

  // Set defaults
  editor.style.fontFamily = "'Courier New', monospace";
  editor.style.color = "#00ff00";
  notepadContainer.style.backgroundColor = `rgba(30, 30, 30, ${opacitySlider.value / 100})`;

  // Version display
  window.electronAPI.getVersion().then((data) => {
    versionSpan.textContent = `v${data.version}`;
  });

  // Window controls
  minimizeBtn.addEventListener('click', () => window.electronAPI.windowControl('minimize'));
  maximizeBtn.addEventListener('click', () => window.electronAPI.windowControl('maximize'));
  closeBtn.addEventListener('click', () => window.electronAPI.windowControl('close'));

  // File operations
  newBtn.addEventListener('click', () => {
    editor.value = '';
    editor.focus();
  });
  openBtn.addEventListener('click', async () => {
    const content = await window.electronAPI.openFile();
    if (content) editor.value = content;
  });
  saveBtn.addEventListener('click', async () => {
    await window.electronAPI.saveFile(editor.value);
  });

  // Customization
  fontSelect.addEventListener('change', () => {
    editor.style.fontFamily = fontSelect.value;
  });
  fontColor.addEventListener('input', () => {
    editor.style.color = fontColor.value;
  });
  opacitySlider.addEventListener('input', () => {
    notepadContainer.style.backgroundColor = `rgba(30, 30, 30, ${opacitySlider.value / 100})`;
  });

  // Update handlers (commented out since auto-updates are disabled)
  /*
  window.electronAPI.onUpdateAvailable(() => {
    console.log('Update available - downloading...');
  });

  window.electronAPI.onUpdateDownloaded(() => {
    if (confirm('Update downloaded. Restart now to install?')) {
      window.electronAPI.restartApp();
    }
  });

  window.electronAPI.onUpdateError((event, error) => {
    console.error('Update error:', error);
    alert(`Update failed: ${error}`);
  });
  */
});