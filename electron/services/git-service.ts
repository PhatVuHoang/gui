import { dialog } from "electron";
import fs from "fs";
import simpleGit from "simple-git";

export class GitService {
  static async cloneRepository(
    _event: Electron.IpcMainInvokeEvent,
    repoUrl: string,
    localPath: string
  ) {
    
    const git = simpleGit({
      progress({ method, stage, progress }) {
        _event.sender.send('git:clone-progress', { method, stage, progress });
        console.log(`git.${method} ${stage} stage ${progress}% complete`);
      },
    });

    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }

    try {
      await git.clone(repoUrl, localPath);
      console.log(`Successfully cloned ${repoUrl} into ${localPath}`);
      return { success: true };
    } catch (error: any) {
      console.error("Error cloning repository:", error);
      return { success: false, error: error.message };
    }
  }

  static async openDirectory() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (canceled || filePaths.length === 0) {
      return { selectedPath: "", isEmpty: true }; // Handle cancelation
    }

    const selectedPath = filePaths[0];

    // Check if the folder is empty
    const isEmpty = fs.readdirSync(selectedPath).length === 0;

    return { selectedPath, isEmpty };
  }
}
