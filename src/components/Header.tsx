import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineLocationOn,
  MdOutlineAssignment,
  MdLogout,
  MdPersonOutline,
} from "react-icons/md";
import WebLogo from "@/assets/WebLogo.svg";
import { logout } from "@/features/auth/authSlice";
import { useCart } from "@/features/cart/CartContext";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { getGlobalCount } = useCart();

  const isHomePage = location.pathname === "/";
  const { token, user } = useSelector((state: any) => state.auth);
  const isLoggedIn = !!token;
  const userName = user?.name || "User";
  const cartCount = getGlobalCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    } else {
      setIsScrolled(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/");
  };

  const headerActive = !isHomePage || isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        headerActive ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={WebLogo} alt="Logo" className="w-8 h-8 lg:w-10 lg:h-10" />
          <span
            className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
              headerActive ? "text-gray-900" : "text-white drop-shadow-md"
            }`}
          >
            Foody
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 relative">
              <Link
                to="/cart"
                className={`p-2 rounded-full transition-all cursor-pointer relative ${
                  headerActive
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-black/20 backdrop-blur-md text-white hover:bg-black/40"
                }`}
              >
                <HiOutlineShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold animate-in fade-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <img
                  src={user?.avatar || "https://i.pravatar.cc/150?u=john"}
                  className={`w-10 h-10 rounded-full border-2 object-cover transition-all duration-300 ${
                    headerActive ? "border-gray-200" : "border-white"
                  }`}
                  alt="User"
                />
                <span
                  className={`hidden lg:block font-semibold transition-colors duration-300 ${
                    headerActive ? "text-gray-900" : "text-white drop-shadow-md"
                  }`}
                >
                  {userName}
                </span>
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-xl z-20 overflow-hidden border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
                    <div className="lg:hidden px-4 py-3 border-b border-gray-50 flex items-center gap-3 mb-2">
                      <img
                        src={user?.avatar || "https://i.pravatar.cc/150?u=john"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                      />
                      <span className="font-bold text-gray-800">
                        {userName}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                    >
                      <MdPersonOutline size={22} className="text-gray-500" />
                      My Profile
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                      <MdOutlineLocationOn
                        size={22}
                        className="text-gray-500"
                      />
                      Delivery Address
                    </button>
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                    >
                      <MdOutlineAssignment
                        size={22}
                        className="text-gray-500"
                      />
                      My Orders
                    </button>
                    <div className="h-[1px] bg-gray-100 my-1 mx-4"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <MdLogout size={22} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                state={{ initialTab: "signin" }}
                className={`px-5 py-2 font-medium border rounded-full transition-all ${
                  headerActive
                    ? "text-gray-900 border-gray-300 hover:bg-gray-100"
                    : "text-white border-white/40 backdrop-blur-sm hover:bg-white/10"
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                state={{ initialTab: "signup" }}
                className={`px-5 py-2 font-bold rounded-full shadow-lg transition-all ${
                  headerActive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
