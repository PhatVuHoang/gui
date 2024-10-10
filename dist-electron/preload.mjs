"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  cloneRepo: (repoUrl, localPath) => electron.ipcRenderer.invoke("git:clone", repoUrl, localPath),
  // Ensure the event name matches
  openDirectory: () => electron.ipcRenderer.invoke("dialog:openDirectory"),
  onCloneProgress: (callback) => electron.ipcRenderer.on("git:clone-progress", callback),
  removeCloneProgress: (callback) => electron.ipcRenderer.removeListener("git:clone-progress", callback),
  getCommitHistory: (localPath, branch) => electron.ipcRenderer.invoke("git:getCommits", localPath, branch),
  getBranches: (localPath) => electron.ipcRenderer.invoke("git:getBranches", localPath)
});
