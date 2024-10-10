import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";

const CommitHistory = () => {
  const location = useLocation();
  const localPath = location.state?.localPath;
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [branches, setBranches] = useState<string[]>([]);

  // Handle fetching branches
  // const handleSelectBranch = async (branch: string) => {
  //   setSelectedBranch(branch);
  //   const commitHistory = await getCommitHistory(localPath, branch);
  //   setCommits(commitHistory);
  // };

  const fetchCommitHistory = async (branch: string) => {
    try {
      const response = await window.electronAPI.getCommitHistory(localPath, branch);
      if (response.success) {
        setCommits(response.data ?? []);
      } else {
        setError(response.error ?? "Failed to fetch commit history.");
      }
    } catch (err) {
      setError("Failed to fetch commit history.");
    }
  };

  const handleSelectBranch = async (branch: string) => {
    fetchCommitHistory(branch);
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await window.electronAPI.getBranches(localPath);
        if (response.success) {
          setBranches(response.data ?? []);
        } else {
          setError(response.error ?? "Failed to fetch branches.");
        }
      } catch (err) {
        setError("Failed to fetch branches.");
      }
    };

    fetchBranches();
  }, [localPath]);

  return (
    <Layout branches={branches} onSelectBranch={handleSelectBranch}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-4xl mb-6">Commit History</h1>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="w-96">
          {commits.map((commit) => (
            <li key={commit.hash} className="border-b border-gray-600 py-2">
              <strong>{commit.message}</strong>
              <div className="text-sm text-gray-400">{commit.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default CommitHistory;
