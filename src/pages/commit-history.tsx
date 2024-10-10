import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables); // Register necessary components

const CommitHistory = () => {
  const location = useLocation();
  const localPath = location.state?.localPath;
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");


  useEffect(() => {
    const fetchCommitHistory = async () => {
      try {
        const response = await window.electronAPI.getCommitHistory(localPath);
        if (response.success) {
          setCommits(response.data ?? []);
        } else {
          setError(response.error ?? "Failed to fetch commit history.");
        }
      } catch (err) {
        setError("Failed to fetch commit history.");
      }
    };

    fetchCommitHistory();
  }, [localPath]);

  return (
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
  );
};

export default CommitHistory;
