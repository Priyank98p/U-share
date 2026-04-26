import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Package, ShoppingBag, MessageCircle, Settings,
  PlusCircle, ShieldCheck
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/my-listings", label: "My Listings", icon: Package },
  { to: "/my-rentals", label: "Rentals", icon: ShoppingBag },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex-col py-8 px-4 z-30">
      <div className="px-4 mb-8 flex flex-col items-start">
        <div className="h-16 w-16 rounded-full overflow-hidden mb-3 border-2 border-indigo-600 ring-4 ring-indigo-50">
          <img 
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullname || 'User'}`} 
            alt="Profile" 
            className="h-full w-full object-cover bg-slate-100" 
          />
        </div>
        <h2 className="font-heading text-lg font-bold text-slate-900">{user?.fullname || "Student"}</h2>
        <div className="flex items-center gap-1 mt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-500">Verified Student</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" /> {label}
            </Link>
          );
        })}
      </nav>

      <Link to="/create-listing" className="mt-auto">
        <Button className="w-full rounded-xl h-12 font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> New Listing
        </Button>
      </Link>
    </aside>
  );
}
