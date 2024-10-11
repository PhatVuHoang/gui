// src/Sidebar.tsx

import React, { useEffect, useRef, useState } from "react";

interface SidebarProps {
  branches: { local: string[]; remote: string[]; current: string }; // Array of branch names
  onSelectBranch: (branch: string) => void; // Function to call when a branch is selected
}

const Sidebar = ({ branches, onSelectBranch }: SidebarProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default sidebar width
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
              open={branches.local.some(
                (branch) => branch === branches.current
              )}
            >
              <summary className="cursor-pointer">Local Branches</summary>
              {branches.local.map((branch, index) => (
                <li
                  key={index}
                  className={`p-2 rounded hover:bg-gray-700 cursor-pointer ${
                    branches.current === branch
                      ? "bg-gray-700 font-bold text-green-500"
                      : ""
                  }`}
                  onClick={() => {
                    onSelectBranch(branch);
                  }}
                >
                  {branches.current === branch ? `*${branch}` : branch}
                </li>
              ))}
            </details>
            <details
              open={branches.remote.some(
                (branch) => branch === branches.current
              )}
            >
              <summary className="cursor-pointer">Remote Branches</summary>
              {branches.remote.map((branch, index) => (
                <li
                  key={index}
                  className={`p-2 rounded hover:bg-gray-700 cursor-pointer ${
                    branches.current === branch ? "bg-gray-700" : ""
                  }`}
                  onClick={() => {
                    onSelectBranch(branch);
                  }}
                >
                  {branches.current === branch ? `*${branch}` : branch}
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
