import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, LogOut, ChevronDown, X, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import axiosInstance from "@/api/axiosInstance";
import { io } from "socket.io-client";

import { useToast } from "@/context/ToastContext";

const CATEGORIES = [
  { label: "Electronics", emoji: "💻" },
  { label: "Books", emoji: "📚" },
  { label: "Calculators", emoji: "🧮" },
  { label: "Project Kits", emoji: "🔧" },
  { label: "Sports", emoji: "⚽" },
  { label: "Lab & Equipment", emoji: "🔬" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const toast = useToast();

  const [showCategories, setShowCategories] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const catRef = useRef(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const fetchUnread = async () => {
      try {
        const res = await axiosInstance.get("/chat/unread-count");
        setUnreadCount(res.data?.data?.unreadCount || 0);
      } catch {
        /* silent */
      }
    };

    fetchUnread();

    // Listen for real-time unread updates via socket
    const socket = io("http://localhost:3000", { withCredentials: true });
    socket.on(`unread_update_${user._id}`, () => {
      fetchUnread();
    });

    return () => socket.disconnect();
  }, [isAuthenticated, user?._id]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <nav className="flex justify-between items-center max-w-[1280px] mx-auto px-6 h-16">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link to="/">
              <h1 className="text-2xl font-extrabold text-[#4F46E5]">U-Share</h1>
            </Link>
            <div className="hidden md:flex items-center mt-1 gap-6">
              <Link to="/browse" className="text-gray-500 hover:text-indigo-600 pb-1 font-medium transition-colors">
                Browse
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => setShowCategories((p) => !p)}
                  className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 pb-1 font-medium transition-colors"
                >
                  Categories <ChevronDown className={`w-4 h-4 transition-transform ${showCategories ? "rotate-180" : ""}`} />
                </button>
                {showCategories && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.label}
                        to={`/browse?category=${encodeURIComponent(cat.label)}`}
                        onClick={() => setShowCategories(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors group"
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/#how-it-works"
                className="text-gray-500 hover:text-indigo-600 pb-1 font-medium transition-colors"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Right */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/wishlist">
                <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full cursor-pointer transition-all hidden sm:block">
                  <Bell className="w-6 h-6" />
                </button>
              </Link>

              {/* Messages with unread badge */}
              <Link to="/messages" className="relative hidden sm:block">
                <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all cursor-pointer">
                  <MessageSquare className="h-6 w-6" />
                </button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/create-listing">
                <Button className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 font-medium hidden cursor-pointer sm:flex shadow-sm hover:scale-[1.02] transition-all">
                  List an Item
                </Button>
              </Link>

              <Link to="/dashboard">
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-100 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors shadow-sm">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullname}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 cursor-pointer text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-100/50 rounded-full border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="px-2 outline-0 bg-transparent text-sm w-48 placeholder:text-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      navigate(`/browse?search=${encodeURIComponent(e.target.value)}`);
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
                    <Bell className="h-6 w-6" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer hidden sm:block">
                    <MessageSquare className="h-6 w-6" />
                  </button>
                </Link>
                <Link to="/login">
                  <Button className="rounded-full px-6 font-medium hidden bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-sm hover:scale-[1.02] transition-all text-white sm:flex">
                    List item
                  </Button>
                </Link>
              </div>
              <Link to="/login">
                <Button className="bg-slate-900 text-white px-6 transition-all ease-in-out cursor-pointer hover:scale-[1.02] hover:bg-slate-800 font-medium rounded-full shadow-sm">
                  Login/Signup
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

    </>
  );
}
