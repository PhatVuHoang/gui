export {};

declare global {
  interface Window {
    electronAPI: {
      cloneRepo: (
        repoUrl: string,
        localPath: string
      ) => Promise<{ success: boolean; error?: string }>;
      openDirectory: () => Promise<{ selectedPath: string; isEmpty: boolean }>;
      onCloneProgress: (callback: (event: any, progress: { progress: number }) => void) => void;
      removeCloneProgress: (callback: (event: any, progress: { progress: number }) => void) => void;
    };
  }
}

interface Commit {
  hash: string;
  message: string;
  author_name: string;
  date: string;
}
