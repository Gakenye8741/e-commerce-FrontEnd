import { useState } from "react";
import {
  ShoppingCart,
  Menu,
  Home,
  Store,
  Info,
  Mail,
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../Features/Auth/AuthSlice";
import type { RootState } from "../App/store";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const dashboardPath = user?.role === "admin" ? "/Admindashboard" : "/user/dashboard";

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Mini Top Navbar */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 z-50 md:hidden backdrop-blur-md bg-brandLight/70 shadow-sm text-brandDark text-sm px-4 py-2 flex justify-between items-center">
          <div className="text-2xl font-bold text-brandDark flex items-center gap-1">
            Nova Cart <ShoppingCart />
          </div>
           <span>Hello, {user?.firstName || "User"} 👋</span>
        </div>
      )}

      {/* Desktop Navbar */}
      <nav className="bg-brandLight/80 backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-40 h-20 md:flex hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between w-full">
          <div className="text-2xl font-bold text-brandDark flex items-center gap-1">
            Nova Cart <ShoppingCart />
          </div>

          <div className="flex items-center space-x-8 text-brandDark font-medium">
            <Link to="/" className="flex items-center gap-1 hover:text-brandMid">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/Shop" className="flex items-center gap-1 hover:text-brandMid">
              <Store className="w-4 h-4" /> Shop
            </Link>
            <Link to="/About" className="flex items-center gap-1 hover:text-brandMid">
              <Info className="w-4 h-4" /> About
            </Link>
            <Link to="/Contact" className="flex items-center gap-1 hover:text-brandMid">
              <Mail className="w-4 h-4" /> Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4 relative">
            <div className="relative cursor-pointer text-brandDark">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </div>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-4 text-sm font-medium">
                <Link to="/Login" className="flex items-center gap-1 hover:text-brandMid">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/Register" className="flex items-center gap-1 hover:text-brandMid">
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center gap-1 text-brandDark hover:text-brandMid"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user?.firstName || "User"} <ChevronDown className="w-4 h-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg py-2 z-50">
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-brandLight/30"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-brandLight/30"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-brandLight/80 border-t border-gray-200 shadow-inner">
        <div className="flex justify-around py-2 text-sm text-brandDark">
          <Link to="/" className="flex flex-col items-center">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/Shop" className="flex flex-col items-center">
            <Store className="w-5 h-5" />
            <span>Shop</span>
          </Link>
          <Link to="/About" className="flex flex-col items-center">
            <Info className="w-5 h-5" />
            <span>About</span>
          </Link>
          <Link to="/Contact" className="flex flex-col items-center">
            <Mail className="w-5 h-5" />
            <span>Contact</span>
          </Link>
          {!isAuthenticated ? (
            <Link to="/Login" className="flex flex-col items-center">
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col items-center focus:outline-none"
              >
                <Menu className="w-5 h-5" />
                <span>More</span>
              </button>

              {isOpen && (
                <div className="absolute bottom-12 right-0 w-40 bg-gray-900 rounded-lg shadow-lg z-50">
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <LayoutDashboard className="inline w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
