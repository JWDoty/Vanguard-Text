; Vanguard-Text\installer.nsh
!define APP_NAME "Vanguard Text"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  File "${BUILD_RESOURCES_DIR}\icon.ico" ; Use NSIS variable for absolute path
  File "${BUILD_RESOURCES_DIR}\icon.png" ; Include tray icon (optional)
SectionEnd