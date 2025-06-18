
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { UserMenu } from "./auth/UserMenu";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              <span className="text-green-600">West County</span>{" "}
              <span className="text-blue-600">Spine & Joint</span>{" "}
              <span className="text-gray-700 text-lg">Admin</span>
            </h1>
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
