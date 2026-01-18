import { NavLink } from "react-router-dom";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";

const BottomNav: React.FC = () => {
    const navItems = [
        { icon: Home, path: "/", label: "Home" },
        { icon: Search, path: "/search", label: "Search" },
        { icon: PlusSquare, path: "/create/post", label: "Create" },
        { icon: Heart, path: "/notifications", label: "Explore" }, // Using heart for notifications or explore? sidebar has both.
        { icon: User, path: "/profile", label: "Profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-slate-900 px-4 py-3 flex justify-around items-center z-50">
            {navItems.map(({ icon: Icon, path, label }) => (
                <NavLink
                    key={label}
                    to={path}
                    className={({ isActive }) =>
                        `transition-colors ${isActive ? "text-blue-500" : "text-slate-400 hover:text-white"
                        }`
                    }
                >
                    <Icon size={26} />
                </NavLink>
            ))}
        </div>
    );
};

export default BottomNav;
