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
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../Features/Auth/AuthSlice";
import type { RootState } from "../App/store";
import { getCart, type CartItem /*, removeFromCart */ } from "../utils/CartStorage";


const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const dashboardPath = user?.role === "admin" ? "/Admindashboard" : "/user/dashboard";

  useEffect(() => {
    const storedCart = getCart();
    setCartItems(storedCart);
  }, [cartDrawerOpen]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + +item.price * item.quantity, 0);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  // Optional remove handler
  // const handleRemove = (productId: number) => {
  //   removeFromCart(productId);
  //   setCartItems(getCart());
  // };

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
            {/* 🛒 Floating Cart Icon */}
            <div
              className="relative cursor-pointer text-brandDark"
              onClick={() => setCartDrawerOpen(true)}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {totalItems}
                </span>
              )}
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

      {/* 🛒 Beautified Mini Cart Drawer */}
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
                          Qty: {item.quantity} ×{" "}
                          <span className="font-medium text-gray-700">Ksh {item.price}</span>
                        </p>
                      </div>

                      {/* Optional Remove button
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemove(item.productId)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      */}
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
    </>
  );
};

export default Navbar;
