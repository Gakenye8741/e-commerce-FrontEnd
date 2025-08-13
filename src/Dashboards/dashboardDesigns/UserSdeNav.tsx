import { NavLink } from "react-router-dom";
import { TrendingUp, LogOut} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../Features/Auth/AuthSlice";


const navItems = [
  {
    name: "Manage Categories",
    path: "ManageCategories",
    icon: <TrendingUp className="w-5 h-5" />,
  },
 
];

export const UserSideNav = ({ onNavItemClick }: { onNavItemClick?: () => void }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    onNavItemClick?.();
  };

  return (
    <aside className="h-full min-h-screen w-full p-4 mt-0 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white space-y-4 overflow-y-auto rounded-r-lg shadow-lg">
      <h4 className="text-center text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 mt-20">
        🛠️ User Panel 👑
      </h4>

      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          onClick={onNavItemClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-indigo-800 ${
              isActive ? "bg-indigo-700 font-semibold shadow text-white" : "text-indigo-200"
            }`
          }
        >
          {item.icon}
          <span className="font-chewy">{item.name}</span>
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all w-full text-left"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-chewy">Logout</span>
      </button>
    </aside>
  );
};
