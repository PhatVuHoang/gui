import simpleGit from "simple-git";
import fs from "fs";
import { dialog } from "electron";

export class GitService {
  static async cloneRepository(
    event: Electron.IpcMainEvent,
    repoUrl: string,
    localPath: string
  ) {
    const git = simpleGit();

    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }

    const cloneProgressCallback = (progress: any) => {
      const percent = Math.round((progress.received / progress.total) * 100);
      event.sender.send("cloneProgress", { progress: percent });
    };

    try {
      await git.clone(
        repoUrl,
        localPath,
        ["--progress"],
        cloneProgressCallback
      );
      console.log(`Successfully cloned ${repoUrl} into ${localPath}`);
      // event.sender.send('cloneRepoResponse', { success: true });
    } catch (error: any) {
      console.error("Error cloning repository:", error);
      event.sender.send("cloneRepoResponse", {
        success: false,
        error: error.message,
      });
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
