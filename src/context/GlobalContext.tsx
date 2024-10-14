import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextType {
  localPath: string;
  setLocalPath: (path: string) => void;
  currentBranch: string;
  setCurrentBranch: (branch: string) => void;
  checkedOutBranch: string;
  setCheckedOutBranch: (branch: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [localPath, setLocalPath] = useState<string>("");
  const [currentBranch, setCurrentBranch] = useState<string>("");
  const [checkedOutBranch, setCheckedOutBranch] = useState<string>("");

  return (
    <GlobalContext.Provider
      value={{
        localPath,
        setLocalPath,
        currentBranch,
        setCurrentBranch,
        checkedOutBranch,
        setCheckedOutBranch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
