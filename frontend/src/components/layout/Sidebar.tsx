import { NavLink } from "react-router-dom";
import {
  Home,
  MessageCircle,
  Search,
  Heart,
  PlusSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Discover", icon: Search, path: "/discover" },
  { label: "Messages", icon: MessageCircle, path: "/messages" },
  { label: "Notifications", icon: Heart, path: "/notifications" },
  { label: "Create", icon: PlusSquare, path: "/create/post" },
  { label: "Profile", icon: User, path: "/profile" },
];

const Sidebar: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");

  }
  return (
    <aside
      className="
        hidden
        md:flex
        fixed
        top-0
        left-0
        bottom-0
        group/sidebar
        h-screen
        w-20 hover:w-64 xl:w-64
        bg-black/95
        backdrop-blur-xl
        border-r border-slate-900
        px-3 py-6
        flex flex-col
        transition-all duration-300 ease-in-out
        z-50
      "
    >
      {/* Logo */}
      <div className="mb-10 flex items-center gap-4 px-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-blue-500/20">
          V
        </div>

        <h1
          className="
            text-2xl font-black text-white tracking-tighter
            opacity-0 group-hover/sidebar:opacity-100 xl:opacity-100
            transition-all duration-300
            whitespace-nowrap
            bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400
          "
        >
          Vibe
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `
              flex items-center gap-4 px-3 py-3.5 rounded-xl
              transition-all duration-200
              ${isActive
                ? "bg-slate-900 text-blue-400 shadow-inner"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }
            `
            }
          >
            {/* ICON — always visible */}
            <Icon size={24} className="shrink-0" />

            {/* LABEL — hover only on smaller screens, always on XL */}
            <span
              className="
                text-sm font-bold tracking-tight
                opacity-0 group-hover/sidebar:opacity-100 xl:opacity-100
                transition-all duration-300
                whitespace-nowrap
              "
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions (Pinned) */}
      <div className="mt-auto pt-6 border-t border-slate-900 space-y-2">
        {/* Settings */}
        <button
          className="
            flex items-center gap-4 px-3 py-3 rounded-xl
            text-slate-400 hover:bg-slate-900 hover:text-white
            transition-all duration-200 w-full
          "
        >
          <Settings size={24} className="shrink-0" />
          <span
            className="
              text-sm font-bold tracking-tight
              opacity-0 group-hover/sidebar:opacity-100 xl:opacity-100
              transition-all duration-300
              whitespace-nowrap
            "
          >
            Settings
          </span>
        </button>

        {/* Logout */}
        <button
          className="
            flex items-center gap-4 px-3 py-3 rounded-xl
            text-red-400/80 hover:bg-red-500/10 hover:text-red-500
            transition-all duration-200 w-full
          "
          onClick={handleLogout}
        >
          <LogOut size={24} className="shrink-0" />
          <span
            className="
              text-sm font-bold tracking-tight
              opacity-0 group-hover/sidebar:opacity-100 xl:opacity-100
              transition-all duration-300
              whitespace-nowrap
            "
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
