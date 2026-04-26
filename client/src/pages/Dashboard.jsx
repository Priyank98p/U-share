import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "@/api/axiosInstance";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  PlusSquare, Bell, Calendar, ChevronRight, Edit, Package
} from "lucide-react";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/users/dashboard-stats");
        const data = res.data?.data;
        setStats(data?.stats || {});
        setRecentBookings(data?.recentBookings || []);
        setTopItems(data?.topItems || []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { label: "Active Rentals", value: stats?.activeRentals ?? "—", subtext: "As borrower", subtextColor: "text-emerald-500" },
    { label: "Total Earnings", value: `₹${stats?.totalEarnings ?? 0}`, subtext: "As owner", subtextColor: "text-emerald-500" },
    { label: "Pending Requests", value: stats?.pendingRequests ?? 0, subtext: "Action needed", subtextColor: "text-rose-500", valueColor: stats?.pendingRequests > 0 ? "text-rose-600" : undefined },
    { label: "Average Rating", value: stats?.averageRating || "—", subtext: `${stats?.totalReviews || 0} reviews`, subtextColor: "text-amber-400" },
  ];

  const getTimeAgo = (dateStr) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-[1280px] w-full animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900">
              Welcome, {user?.fullname?.split(" ")[0] || "Student"}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Here's what's happening with your rentals.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative p-2 text-slate-400 hover:bg-slate-200 rounded-full cursor-pointer transition-colors">
              <Bell className="w-6 h-6" />
              {stats?.pendingRequests > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-50"></span>
              )}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-28 animate-pulse border border-slate-100 p-6"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className={`font-heading text-4xl font-black tracking-tight ${stat.valueColor || "text-slate-900"}`}>{stat.value}</span>
                  <span className={`text-sm font-bold ${stat.subtextColor}`}>{stat.subtext}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Activity Feed */}
          <section className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
              <Link to="/my-rentals" className="text-indigo-600 font-bold text-sm hover:underline">View All</Link>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-5">
                {recentBookings.map((booking) => {
                  const isBorrower = booking.borrowerId?._id === user?._id;
                  return (
                    <div key={booking._id} className="flex gap-4 group">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                        {booking.itemId?.images?.[0] ? (
                          <img src={booking.itemId.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 border-b border-slate-50 pb-5">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-slate-900 text-sm">
                            {isBorrower ? (
                              <>You requested <span className="font-bold">{booking.itemId?.title || "an item"}</span></>
                            ) : (
                              <><span className="font-bold">{booking.borrowerId?.fullname || "Someone"}</span> requested your <span className="font-bold">{booking.itemId?.title || "item"}</span></>
                            )}
                          </p>
                          <span className="text-xs font-bold text-slate-400 shrink-0 ml-4">{getTimeAgo(booking.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-500">
                          Status: <span className={`font-bold ${booking.status === 'approved' ? 'text-emerald-600' : booking.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'}`}>{booking.status}</span>
                          {" · "}₹{booking.totalPrice}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-bold">No recent activity yet</p>
                <p className="text-sm text-slate-400 mt-1">Start browsing or listing items!</p>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl shadow-indigo-600/30">
              <h3 className="font-heading text-lg font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/create-listing">
                  <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10 group">
                    <span className="flex items-center gap-3 font-bold text-sm">
                      <PlusSquare className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" /> List New Item
                    </span>
                    <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                </Link>
                <Link to="/my-rentals">
                  <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10 group">
                    <span className="flex items-center gap-3 font-bold text-sm">
                      <Calendar className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" /> Manage Rentals
                    </span>
                    <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Top Listings */}
        {topItems.length > 0 && (
          <section className="mt-12 mb-24">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">Your Listings</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Your active items on the marketplace</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topItems.map((listing) => (
                <Link to={`/item/${listing._id}`} key={listing._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-200 group">
                  <div className="h-48 relative overflow-hidden bg-slate-100">
                    <img src={listing.images?.[0] || "https://placehold.co/500x300"} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-indigo-600 shadow-sm">
                      {listing.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-heading text-lg font-bold text-slate-900 mb-1">{listing.title}</h4>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-extrabold text-indigo-600 font-heading">₹{listing.rentalPricePerDay}</span>
                        <span className="text-sm font-bold text-slate-400">/day</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}