// src/Sidebar.tsx

import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";

const Sidebar = () => {
  const { localPath, setCurrentBranch } = useGlobalContext();
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default sidebar width
  const [localBranches, setLocalBranches] = useState<string[]>([]);
  const [remoteBranches, setRemoteBranches] = useState<string[]>([]);
  const [checkedOutBranch, setCheckedOutBranch] = useState<string>("");

  const isResizing = useRef(false); // Reference to track resizing state
  const startX = useRef(0); // Reference to store the starting X position

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true; // Set resizing state to true
    startX.current = e.clientX; // Store the starting mouse position
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = sidebarWidth + (e.clientX - startX.current); // Calculate new width
      setSidebarWidth(newWidth); // Update sidebar width
      startX.current = e.clientX; // Update starting position
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false; // Set resizing state to false
  };

  // Attach mouse move and mouse up events to the window
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [sidebarWidth]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await window.electronAPI.getBranches(localPath);
        if (response.success) {
          setLocalBranches(response.data?.local ?? []);
          setRemoteBranches(response.data?.remote ?? []);
          setCurrentBranch(response.data?.current ?? "");
          setCheckedOutBranch(response.data?.current ?? "");
        } else {
          console.error("Failed to fetch branches.");
        }
      } catch (err) {
        console.error("Failed to fetch branches.");
      }
    };

    fetchBranches();
  }, []);

  const onCheckoutBranch = async (branch: string) => {
    try {
      await window.electronAPI.checkoutBranch(localPath, branch);
      setCheckedOutBranch(branch);
    } catch (error) {
      console.error("Failed to checkout branch:", error);
    }
  };

  return (
    <>
      <div
        className="relative h-full bg-gray-900 text-white py-4 pl-4 pr-1 shadow-md"
        style={{ width: `${sidebarWidth}px` }} // Set dynamic width
      >
        <div className="overflow-y-auto overflow-x-hidden h-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <h2 className="text-lg font-semibold mb-4">Branches</h2>
          <ul className="space-y-2">
            <details
              open={localBranches.some((branch) => branch === checkedOutBranch)}
            >
              <summary className="cursor-pointer">Local Branches</summary>
              {localBranches.map((branch, index) => (
                <li
                  key={index}
                  className={`p-2 rounded hover:bg-gray-700 cursor-pointer ${
                    checkedOutBranch === branch
                      ? "bg-gray-700 font-bold text-green-500"
                      : ""
                  }`}
                  onClick={() => {
                    setCurrentBranch(branch);
                  }}
                  onDoubleClick={() => {
                    onCheckoutBranch(branch);
                  }}
                >
                  {checkedOutBranch === branch ? `*${branch}` : branch}
                </li>
              ))}
            </details>
            <details
              open={remoteBranches.some((branch) => branch === checkedOutBranch)}
            >
              <summary className="cursor-pointer">Remote Branches</summary>
              {remoteBranches.map((branch, index) => (
                <li
                  key={index}
                  className={`p-2 rounded hover:bg-gray-700 cursor-pointer ${
                    checkedOutBranch === branch ? "bg-gray-700" : ""
                  }`}
                  onClick={() => {
                    setCurrentBranch(branch);
                  }}
                  onDoubleClick={() => {
                    onCheckoutBranch(branch);
                  }}
                >
                  {checkedOutBranch === branch ? `*${branch}` : branch}
                </li>
              ))}
            </details>
          </ul>
        </div>
        <div
          className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-600" // Resizable area
          onMouseDown={handleMouseDown} // Start resizing on mouse down
        />
      </div>
    </>
  );
};

export default Sidebar;
