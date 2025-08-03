import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Home,
  Store,
  Info,
  Mail,
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  X
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../Features/Auth/AuthSlice";
import type { RootState } from "../App/store";
import type { CartItem } from "../utils/CartTYpes";
import { getCart } from "../utils/CartStorage";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const dashboardPath = user?.role === "admin" ? "/Admindashboard" : "/user/dashboard";

  const updateCart = () => {
    const storedCart = getCart();
    setCartItems(storedCart);
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + +item.price * item.quantity, 0);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Topbar */}
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
            <Link to="/" className={`flex items-center gap-1 hover:text-brandMid ${isActive("/") && "text-brandMid"}`}>
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/Shop" className={`flex items-center gap-1 hover:text-brandMid ${isActive("/Shop") && "text-brandMid"}`}>
              <Store className="w-4 h-4" /> Shop
            </Link>
            <Link to="/About" className={`flex items-center gap-1 hover:text-brandMid ${isActive("/About") && "text-brandMid"}`}>
              <Info className="w-4 h-4" /> About
            </Link>
            <Link to="/Contact" className={`flex items-center gap-1 hover:text-brandMid ${isActive("/Contact") && "text-brandMid"}`}>
              <Mail className="w-4 h-4" /> Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4 relative">
            <div
              className="relative cursor-pointer text-brandDark"
              onClick={() => setCartDrawerOpen(true)}
            >
              <ShoppingCart className="w-6 h-6" />
              <span
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                  totalItems > 0 ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
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

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end transition-opacity duration-300">
          <div className="w-80 bg-white h-full p-4 shadow-lg relative transform transition-transform duration-300">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() => setCartDrawerOpen(false)}
            >
              <X />
            </button>

            <h2 className="text-lg font-bold mb-4 text-gray-700">Your Cart</h2>

            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 text-sm mt-8">🛒 Your cart is currently empty.</p>
            ) : (
              <>
                <ul className="space-y-4 overflow-y-auto max-h-[70%] pr-2">
                  {cartItems.map((item) => (
                    <li key={item.productId} className="flex items-center gap-4 border-b pb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × <span className="font-medium text-gray-700">Ksh {item.price}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t pt-4 text-right">
                  <p className="text-sm font-medium text-gray-800">
                    Subtotal: <span className="text-brandDark font-bold">Ksh {subtotal.toLocaleString()}</span>
                  </p>
                </div>

                <Link
                  to="/cart"
                  className="block mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 text-center rounded"
                >
                  Go to Cart
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* 📱 Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden backdrop-blur-md bg-black/40 border-t border-white/10 shadow-md">
        <div className="flex justify-around items-center text-white text-sm py-2 relative">
          <Link to="/" className={`flex flex-col items-center ${isActive("/") ? "text-brandMid" : ""}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>

          <Link to="/Shop" className={`flex flex-col items-center ${isActive("/Shop") ? "text-brandMid" : ""}`}>
            <Store className="w-5 h-5" />
            <span className="text-xs">Shop</span>
          </Link>

          <Link to="/About" className={`flex flex-col items-center ${isActive("/About") ? "text-brandMid" : ""}`}>
            <Info className="w-5 h-5" />
            <span className="text-xs">About</span>
          </Link>

           <Link to="/Contact" className={`flex flex-col items-center ${isActive("/About") ? "text-brandMid" : ""}`}>
            <Mail className="w-5 h-5" />
            <span className="text-xs">Contact</span>
          </Link>

          <button onClick={() => setMoreOpen(!moreOpen)} className="flex flex-col items-center">
            <FaBars className="w-5 h-5" />
            <span className="text-xs">More</span>
          </button>

          {moreOpen && isAuthenticated && (
            <div className="absolute bottom-14 right-2 bg-white shadow-lg rounded-lg text-sm w-40 z-50 text-gray-700">
              <Link
                to={dashboardPath}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={() => {
                  setMoreOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🛒 Floating Cart Button */}
      <button
        onClick={() => setCartDrawerOpen(true)}
        className="fixed bottom-16 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 md:hidden"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
              totalItems > 0 ? "bg-green-400" : "bg-gray-400"
            }`}
          ></span>
        </div>
      </button>
    </>
  );
};

export default Navbar;
