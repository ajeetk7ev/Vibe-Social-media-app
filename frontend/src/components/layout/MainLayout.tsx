import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-black">
      <Sidebar />
      <main className="flex-1 flex justify-center md:ml-20 xl:ml-64 mb-16 md:mb-0">
        <div className="w-full max-w-2xl py-6">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
