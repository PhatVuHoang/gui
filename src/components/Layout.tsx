import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default Layout;
