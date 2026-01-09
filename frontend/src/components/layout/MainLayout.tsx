import Sidebar from "./Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-950">
      <Sidebar />
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl py-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
