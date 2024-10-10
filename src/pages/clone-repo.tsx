import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CloneRepo = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [cloneStatus, setCloneStatus] = useState("");
  const [isCloning, setIsCloning] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const getRepoName = (url: string) => {
    const match = url.match(/\/([^/]+)\.git$/);
    return match ? match[1] : "repository"; // Fallback to 'repository' if extraction fails
  };

  const handleCloneRepo = async () => {
    setIsCloning(true); // Start cloning
    const response = await window.electronAPI.cloneRepo(repoUrl, localPath);
    if (response.success) {
      setCloneStatus("Repository cloned successfully.");
      navigate("/commit-history", { state: { localPath } });
    } else {
      setCloneStatus(`Error: ${response.error}`);
    }

    setIsCloning(false); // End cloning process
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

  const handleOpenExistRepo = async () => {
    const { selectedPath } = await window.electronAPI.openDirectory();
    if (selectedPath) {
      navigate("/commit-history", { state: { localPath: selectedPath } });
    }
  };

  useEffect(() => {
    // Listen for clone progress updates from Electron main process
    const onProgress = (_event: any, { progress }: any) => {
      setProgress(progress);
    };

    // Register the progress listener
    window.electronAPI.onCloneProgress(onProgress);

    return () => {
      // Clean up listener when the component unmounts
      window.electronAPI.removeCloneProgress(onProgress);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl mb-6">Clone Repository</h1>
      <div className="mb-4 w-96">
        <input
          type="text"
          className="w-full bg-surface border border-gray-600 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <div className="flex">
          <input
            type="text"
            className="w-full bg-surface border border-gray-600 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Local Path"
            value={localPath}
            onChange={(e) => setLocalPath(e.target.value)}
          />
          <button
            onClick={handleOpenDirectory}
            className="bg-blue-600 text-white rounded-md px-4 mb-2 ml-2 hover:bg-blue-500 transition duration-300"
          >
            Browse
          </button>
        </div>
        {isCloning ? (
          <div className="w-full max-w-lg bg-gray-300 rounded-lg overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-12 flex items-center justify-center text-white text-xl font-bold rounded-lg transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        ) : (
          <button
            onClick={handleCloneRepo}
            className="w-full hover:bg-secondary transition duration-300"
          >
            Clone Repo
          </button>
        )}
        <button
          onClick={handleOpenExistRepo}
          className="w-full bg-transparent hover:bg-transparent transition duration-300"
        >
          Open Exist Repository
        </button>
      </div>

      <p className="text-lg mb-4">{cloneStatus}</p>
    </div>
  );
};

export default CloneRepo;
