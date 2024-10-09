import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  cloneRepo: (repoUrl: string, localPath: string) => ipcRenderer.send('git:clone', repoUrl, localPath), // Ensure the event name matches
  onCloneProgress: (callback: (event: any, progress: { progress: number }) => void) => ipcRenderer.on('cloneProgress', callback),
  removeCloneProgress: (callback: (event: any, progress: { progress: number }) => void) => ipcRenderer.removeListener('cloneProgress', callback),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
})
