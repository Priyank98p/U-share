import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  PackageSearch,
  Settings as SettingsIcon,
  CheckCircle2,
  Ban,
  LogOut,
  TrendingUp,
  Loader2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import axiosInstance from "@/api/axiosInstance";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [moderationFeed, setModerationFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [user, activeTab]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "overview") {
        const res = await axiosInstance.get("/admin/stats");
        setStats(res.data.data);
      } else if (activeTab === "verification") {
        const res = await axiosInstance.get("/admin/pending-verifications");
        setPendingUsers(res.data.data);
      } else if (activeTab === "listings" || activeTab === "disputes") {
        const res = await axiosInstance.get("/admin/moderation-feed");
        setModerationFeed(res.data.data);
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Admin logged out");
    navigate("/login");
  };

  const handleApproveUser = async (userId, name) => {
    try {
      await axiosInstance.patch(`/admin/verify-user/${userId}`);
      toast.success(`${name} has been verified.`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.log(error)
      toast.error("Failed to verify user");
    }
  };

  const handleToggleItem = async (itemId, title) => {
    try {
      const res = await axiosInstance.patch(`/admin/toggle-item/${itemId}`);
      toast.success(
        `${title} is now ${res.data.data.isActive ? "active" : "inactive"}.`,
      );
      setModerationFeed((prev) =>
        prev.map((item) => (item._id === itemId ? res.data.data : item)),
      );
    } catch (error) {
      console.log(error)
      toast.error("Failed to update item status");
    }
  };

  const KPI_CARDS = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          trend: "Platform reach",
          icon: Users,
          color: "text-blue-500",
          bg: "bg-blue-100",
        },
        {
          label: "Verified Users",
          value: stats.verifiedUsers,
          trend: "Trusted base",
          icon: CheckCircle2,
          color: "text-emerald-500",
          bg: "bg-emerald-100",
        },
        {
          label: "Platform Revenue",
          value: `₹${stats.totalRevenue}`,
          trend: "5% platform fee",
          icon: TrendingUp,
          color: "text-indigo-500",
          bg: "bg-indigo-100",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 text-slate-300 flex flex-col hidden bg-slate-100 rounded md:flex sticky h-auto z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h1 className="font-black text-white tracking-tight">
            <span className="text-indigo-500 text-2xl ml-1 font-bold">
              ADMIN
            </span>
          </h1>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 px-3">
            Dashboard
          </div>
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-800  font-bold transition-all ${activeTab === "overview" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Analytics Overview
          </button>

          <div className="text-xs font-bold text-gray-800  uppercase tracking-wider mt-6 mb-2 px-3">
            Moderation
          </div>
          <button
            onClick={() => setActiveTab("verification")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-gray-800  transition-all ${activeTab === "verification" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <Users className="w-5 h-5" /> User Verification
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-gray-800  transition-all ${activeTab === "listings" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <PackageSearch className="w-5 h-5" /> Listing Feed
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-800 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all font-bold"
          >
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative h-screen overflow-y-auto">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 capitalize font-heading">
            {activeTab.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              {user?.fullname?.[0] || "A"}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-500 font-bold">
                Loading dashboard data...
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* TAB: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {KPI_CARDS.map((kpi, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-500">
                              {kpi.label}
                            </p>
                            <h3 className="text-3xl font-black text-slate-900 mt-2 font-heading">
                              {kpi.value}
                            </h3>
                            <p className="text-xs font-bold text-indigo-500 mt-2 bg-indigo-50 inline-block px-2 py-1 rounded-md">
                              {kpi.trend}
                            </p>
                          </div>
                          <div
                            className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center transform group-hover:scale-110 transition-transform`}
                          >
                            <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px]">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 font-heading">
                      Recent Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 mb-4">
                          Verification Rate
                        </h4>
                        <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-1000"
                            style={{
                              width: `${(stats?.verifiedUsers / stats?.totalUsers) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 mt-2">
                          {Math.round(
                            (stats?.verifiedUsers / stats?.totalUsers) * 100,
                          )}
                          % of users are verified
                        </p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 mb-4">
                          Inventory Status
                        </h4>
                        <p className="text-3xl font-black text-indigo-600 font-heading">
                          {stats?.activeListings}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                          Total active listings currently on campus
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: USER VERIFICATION */}
              {activeTab === "verification" && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 font-heading">
                        Pending Verifications
                      </h3>
                      <p className="text-sm text-slate-500">
                        Review student IDs for platform approval.
                      </p>
                    </div>
                  </div>
                  {pendingUsers.length === 0 ? (
                    <div className="p-20 text-center text-slate-400">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
                      <p className="font-bold text-lg">All caught up!</p>
                      <p className="text-sm">
                        No pending user verifications at the moment.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Department / Year</th>
                            <th className="px-6 py-4">ID Photo</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {pendingUsers.map((u) => (
                            <tr
                              key={u._id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <p className="font-bold text-slate-900">
                                  {u.fullname}
                                </p>
                                <p className="text-xs text-slate-500 font-medium">
                                  {u.email}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                                  {u.department} {u.year}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <a
                                  href={u.avatar}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-16 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-slate-400" />
                                </a>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveUser(u._id, u.fullname)
                                  }
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4"
                                >
                                  Approve
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: LISTINGS MODERATION */}
              {activeTab === "listings" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {moderationFeed.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex gap-6 hover:shadow-md transition-shadow relative overflow-hidden"
                      >
                        {!item.isActive && (
                          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                            INACTIVE
                          </div>
                        )}
                        <img
                          src={item.images?.[0] || "https://placehold.co/100"}
                          alt={item.title}
                          className="w-24 h-24 rounded-2xl object-cover border border-slate-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            Owner:{" "}
                            <span className="font-bold">
                              {item.ownerId?.fullname || "Unknown"}
                            </span>
                          </p>
                          <p className="text-sm font-black text-indigo-600 mt-1">
                            ₹{item.rentalPricePerDay}/day
                          </p>

                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              variant={item.isActive ? "outline" : "default"}
                              onClick={() =>
                                handleToggleItem(item._id, item.title)
                              }
                              className={`rounded-xl flex-1 text-xs font-bold ${item.isActive ? "border-rose-200 text-rose-600 hover:bg-rose-50" : "bg-emerald-500 text-white"}`}
                            >
                              {item.isActive ? (
                                <>
                                  <Ban className="w-3 h-3 mr-1" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                  Activate
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
