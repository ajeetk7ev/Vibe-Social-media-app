import { NavLink } from "react-router-dom";
import {
  Home,
  Clapperboard,
  MessageCircle,
  Search,
  Compass,
  Heart,
  PlusSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Reels", icon: Clapperboard, path: "/reels" },
  { label: "Messages", icon: MessageCircle, path: "/messages" },
  { label: "Search", icon: Search, path: "/search" },
  { label: "Explore", icon: Compass, path: "/explore" },
  { label: "Notifications", icon: Heart, path: "/notifications" },
  { label: "Create", icon: PlusSquare, path: "/create" },
  { label: "Profile", icon: User, path: "/profile/username_data" },
];

const Sidebar: React.FC = () => {
  return (
    <aside
      className="
        fixed
        top-0
        left-0
        bottom-0
        group/sidebar
        h-screen
        w-20 hover:w-64
        bg-slate-950
        border-r border-slate-800
        px-3 py-6
        flex flex-col
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-4 px-2">
        <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold shrink-0">
          S
        </div>

        <h1
          className="
            text-xl font-bold text-white tracking-wide
            opacity-0 group-hover/sidebar:opacity-100
            transition-opacity duration-200
            whitespace-nowrap
          "
        >
          SocialApp
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `
              flex items-center gap-4 px-3 py-3 rounded-lg
              transition-colors
              ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }
            `
            }
          >
            {/* ICON — always visible */}
            <Icon size={22} className="shrink-0" />

            {/* LABEL — hover only */}
            <span
              className="
                text-sm font-medium
                opacity-0 group-hover/sidebar:opacity-100
                transition-opacity duration-200
                whitespace-nowrap
              "
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions (Pinned) */}
      <div className="mt-auto pt-4 border-t border-slate-800 space-y-1">
        {/* Settings */}
        <button
          className="
            flex items-center gap-4 px-3 py-3 rounded-lg
            text-slate-300 hover:bg-slate-900 hover:text-white
            transition-colors w-full
          "
        >
          <Settings size={22} className="shrink-0" />
          <span
            className="
              text-sm font-medium
              opacity-0 group-hover/sidebar:opacity-100
              transition-opacity duration-200
              whitespace-nowrap
            "
          >
            Settings
          </span>
        </button>

        {/* Logout */}
        <button
          className="
            flex items-center gap-4 px-3 py-3 rounded-lg
            text-red-400 hover:bg-red-500/10 hover:text-red-500
            transition-colors w-full
          "
        >
          <LogOut size={22} className="shrink-0" />
          <span
            className="
              text-sm font-medium
              opacity-0 group-hover/sidebar:opacity-100
              transition-opacity duration-200
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
