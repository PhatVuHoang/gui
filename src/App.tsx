import { useEffect, useState } from "react";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [cloneStatus, setCloneStatus] = useState("");
  const [progress, setProgress] = useState(0); // To hold clone progress percentage
  const [isCloning, setIsCloning] = useState(false);

  const getRepoName = (url: string) => {
    const match = url.match(/\/([^/]+)\.git$/);
    return match ? match[1] : "repository"; // Fallback to 'repository' if extraction fails
  };

  const handleCloneRepo = async () => {
    setIsCloning(true); // Start cloning
    const response = await window.electronAPI.cloneRepo(repoUrl, localPath);

    if (response.success) {
      setCloneStatus('Repository cloned successfully.');
    } else {
      setCloneStatus(`Error: ${response.error}`);
    }
    
    setIsCloning(false); // End cloning process
    setProgress(0); // Reset progress bar
  };

  const handleOpenDirectory = async () => {
    const { selectedPath, isEmpty } = await window.electronAPI.openDirectory();

    if (selectedPath) {
      // If the folder is not empty, append the repository name
      if (!isEmpty) {
        const repoName = getRepoName(repoUrl);
        const newPath = `${selectedPath}/${repoName}`;
        setLocalPath(newPath); // Set the new path with the repository name
      } else {
        setLocalPath(selectedPath); // Use the selected path if the folder is empty
      }
    }
  };

    // Listen to clone progress event from preload script
    useEffect(() => {
      const onProgress = (_event: any, progressData: any) => {
        const percent = progressData.progress;
        setProgress(percent); // Update progress percentage
      };
    
      window.electronAPI.onCloneProgress(onProgress);
    
      return () => {
        // Cleanup event listener when component unmounts
        window.electronAPI.removeCloneProgress(onProgress);
      };
    }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Simple-Git Operations
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Clone Repository
        </h3>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Local Path"
            value={localPath}
            onChange={(e) => setLocalPath(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
            disabled={!repoUrl}
          />
          <button
            disabled={!repoUrl}
            onClick={handleOpenDirectory}
            className="absolute right-1 top-1 bottom-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Browse
          </button>
        </div>

        <button
          onClick={handleCloneRepo}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          disabled={isCloning}
        >
          {isCloning ? 'Cloning...' : 'Clone Repo'}
        </button>

        {isCloning && (
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-width"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">{cloneStatus}</p>
      </div>
    </div>
  );
}

export default App;
