import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  cloneRepo: (repoUrl: string, localPath: string) => ipcRenderer.invoke('git:clone', repoUrl, localPath), // Ensure the event name matches
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  onCloneProgress: (callback: any) => ipcRenderer.on('git:clone-progress', callback),
  removeCloneProgress: (callback: any) => ipcRenderer.removeListener('git:clone-progress', callback),
  getCommitHistory: (localPath: string) => ipcRenderer.invoke('git:getCommits', localPath),
})
