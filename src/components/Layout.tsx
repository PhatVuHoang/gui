import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";

const Layout = ({
  children,
  branches,
  onSelectBranch,
}: PropsWithChildren<{
  branches: { local: string[]; remote: string[]; current: string };
  onSelectBranch: (branch: string) => void;
}>) => {
  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar branches={branches} onSelectBranch={onSelectBranch} />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Layout;
