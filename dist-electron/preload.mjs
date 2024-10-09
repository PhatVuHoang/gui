"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  cloneRepo: (repoUrl, localPath) => electron.ipcRenderer.send("git:clone", repoUrl, localPath),
  // Ensure the event name matches
  onCloneProgress: (callback) => electron.ipcRenderer.on("cloneProgress", callback),
  removeCloneProgress: (callback) => electron.ipcRenderer.removeListener("cloneProgress", callback),
  openDirectory: () => electron.ipcRenderer.invoke("dialog:openDirectory")
});
