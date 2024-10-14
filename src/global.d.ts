export {};

declare global {
  interface Window {
    electronAPI: {
      cloneRepo: (
        repoUrl: string,
        localPath: string
      ) => Promise<{ success: boolean; error?: string }>;
      openDirectory: () => Promise<{ selectedPath: string; isEmpty: boolean }>;
      onCloneProgress: (
        callback: (event: any, progress: { progress: number }) => void
      ) => void;
      removeCloneProgress: (
        callback: (event: any, progress: { progress: number }) => void
      ) => void;
      getCommitHistory: (
        localPath: string,
        branch: string
      ) => Promise<{ success: boolean; data?: Commit[]; error?: string }>;
      getBranches: (localPath: string) => Promise<{
        success: boolean;
        data?: { current: string; local: string[]; remote: string[] };
      }>;
      checkoutBranch: (localPath: string, branch: string) => Promise<void>;
    };
  }
}

interface Commit {
  hash: string;
  message: string;
  author_name: string;
  date: string;
}
