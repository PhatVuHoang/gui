import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useGlobalContext } from "../context/GlobalContext";

const CommitHistory = () => {
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const { currentBranch, localPath } = useGlobalContext();

  const fetchCommitHistory = async (branch: string) => {
    try {
      const response = await window.electronAPI.getCommitHistory(
        localPath,
        branch
      );
      if (response.success) {
        setCommits(response.data ?? []);
      } else {
        setError(response.error ?? "Failed to fetch commit history.");
      }
    } catch (err) {
      setError("Failed to fetch commit history.");
    }
  };

  useEffect(() => {
    const fetchCommits = async () => {
      await fetchCommitHistory(currentBranch ?? "");
    };

    fetchCommits();
  }, [currentBranch]);

  return (
    <Layout>
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
