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
        _event.sender.send("git:clone-progress", { method, stage, progress });
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

  static async getCommits(localPath: string, branch: string) {
    if (!branch) {
      console.log('Branch name is required');
      return { success: true, data: [] };
    }
    const git = simpleGit(localPath);
    try {
      const log = await git.log([branch]);
      return { success: true, data: log.all };
    } catch (error: any) {
      console.log("Error fetching commits:", error);
      return { success: false, error: error.message };
    }
  }

  static async checkoutBranch(localPath: string, branch: string) {
    const git = simpleGit(localPath);
    try {
      await git.checkout(branch);
      return { success: true };
    } catch (error: any) {
      console.error("Error checking out branch:", error);
      return { success: false, error: error.message };
    }
  }

  static async getBranches(localPath: string) {
    const git = simpleGit(localPath);
    try {
      const branchSummary = await git.branch();
      const remoteBranches = await git.branch(["-r"]);
      // Local branches
      const localBranches = branchSummary.all.filter(
        (branch) => !branch.includes("remotes/")
      );

      // Remote branches
      const remoteBranchList = remoteBranches.all.map((branch) =>
        branch.replace("remotes/", "")
      );

      // Current branch
      const currentBranch = branchSummary.current;
      return {
        success: true,
        data: {
          current: currentBranch,
          local: localBranches,
          remote: remoteBranchList,
        },
      };
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      return {
        success: false,
        data: {
          current: "",
          local: [],
          remote: [],
        },
      };
    }
  }
}
