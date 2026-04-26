import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, MessageSquare,LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <nav className="flex justify-between items-center max-w-302 mx-auto px-6 h-16">
        {/* left side */}
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="text-2xl font-extrabold text-[#4F46E5]">U-Share</h1>
          </Link>
          <div className="hidden md:flex items-center mt-2 gap-6">
            <Link to="/browse">
              <p className="text-gray-500 hover:border-[#4338CA]  hover:border-b-2 pb-1 font-medium">
                Browse
              </p>
            </Link>
            <Link>
              <p className="text-gray-500 hover:border-[#4338CA] hover:border-b-2 pb-1 font-medium">
                Categories
              </p>
            </Link>
            <Link>
              <p className="text-gray-500 hover:border-[#4338CA] hover:border-b-2 pb-1 font-medium">
                How it works
              </p>
            </Link>
          </div>
        </div>

        {/* right side */}
        {isAuthenticated ? (
          // LOGGED IN STATE
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full cursor-pointer transition-all hidden sm:block">
              <Bell className="w-6 h-6" />
            </button>

            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer hidden sm:block ">
                <MessageSquare className="h-6 w-6" />
              </button>

            <Link to="/create-listing">
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 font-medium hidden cursor-pointer sm:flex">
                List an Item
              </Button>
            </Link>

            {/* Profile Avatar leading to Dashboard */}
            <Link to="/dashboard">
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-100 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
                <img
                  src={
                    user?.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Fallback"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 cursor-pointer text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search item"
                className="px-2 outline-0"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer ">
                <Bell className="h-6 w-6" />
              </button>

              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer hidden sm:block ">
                <MessageSquare className="h-6 w-6" />
              </button>

              <Button className="rounded-full px-6 font-medium hidden bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white sm:flex">
                List item
              </Button>
            </div>

            <Link to="/login">
              <Button className="bg-gray-200 px-6 transition-all ease-in-out cursor-pointer hover:scale-102 hover:bg-green-700 hover:text-white font-medium rounded-full">
                Login/Signup
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
