import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Package, ShoppingCart, MessageSquare, Settings, 
  PlusCircle, Bell, Camera, Laptop, CheckCircle, PlusSquare, 
  Calendar, Info, Edit, ShieldCheck ,ChevronRight
} from "lucide-react";

// 🧠 SDE Best Practice: Separate data from UI presentation
const stats = [
  { label: "Active Rentals", value: "4", subtext: "+1 this week", subtextColor: "text-emerald-500" },
  { label: "Monthly Earnings", value: "$120", subtext: "Paid out", subtextColor: "text-emerald-500" },
  { label: "Pending Requests", value: "2", subtext: "Action required", subtextColor: "text-rose-500", valueColor: "text-rose-600" },
  { label: "Average Rating", value: "4.9", subtext: "★", subtextColor: "text-amber-400" }
];

const recentActivity = [
  { id: 1, type: "request", user: "Sarah", item: "Sony A7III Camera", time: "2h ago", details: "Rental period: Mar 15 - Mar 18 (3 days)", icon: Camera, color: "text-indigo-600" },
  { id: 2, type: "reminder", user: "James Wilson", item: "MacBook Pro", time: "5h ago", details: "Borrower: James Wilson. Due by 6:00 PM today.", icon: Laptop, color: "text-emerald-600" },
  { id: 3, type: "success", item: "Dyson Airwrap", time: "Yesterday", details: "You've successfully rented an item from Emily S.", icon: CheckCircle, color: "text-indigo-500" }
];

const upcomingReturns = [
  { id: 1, item: "MacBook Pro 14\"", due: "Due in 4 hours", urgent: true, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80" },
  { id: 2, item: "Dell 27\" 4K Monitor", due: "Due Tomorrow", urgent: false, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80" }
];

const topListings = [
  { id: 1, title: "iPhone 14 Pro", category: "TECH", rentals: 12, price: 15, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80" },
  { id: 2, title: "Organic Chemistry", category: "BOOKS", rentals: 8, price: 5, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80" },
  { id: 3, title: "TI-84 Calculator", category: "TOOLS", rentals: 15, price: 3, image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&q=80" }
];

export default function Dashboard() {
  return (
    // We use a specific layout here to accommodate the fixed sidebar
    <div className="min-h-screen bg-slate-50 flex items-start">
      
      {/* 💻 SIDEBAR (Desktop Only) */}
      <aside className="hidden lg:flex w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex-col py-8 px-4 z-30">
        
        {/* User Profile Snippet */}
        <div className="px-4 mb-8 flex flex-col items-start">
          <div className="h-16 w-16 rounded-full overflow-hidden mb-3 border-2 border-indigo-600 ring-4 ring-indigo-600/10">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Alex Rivera" className="h-full w-full object-cover bg-slate-100" />
          </div>
          <h2 className="font-heading text-lg font-bold text-slate-900">Alex Rivera</h2>
          <div className="flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-500">Verified Student</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/my-listings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">
            <Package className="w-5 h-5" /> My Listings
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">
            <ShoppingCart className="w-5 h-5" /> Rentals
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">
            <MessageSquare className="w-5 h-5" /> Messages
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        {/* Add Listing CTA */}
        <Link to="/create-listing">
        <Button className="mt-auto w-full rounded-xl h-12 font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> New Listing
        </Button>
        </Link>
      </aside>

      {/* 🚀 MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-6 lg:p-10 max-w-[1280px] w-full">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">Good Morning, Alex</h1>
            <p className="font-sans text-slate-500 font-medium mt-1">Here's what's happening with your rentals today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative p-2 text-slate-400 hover:bg-slate-200 rounded-full cursor-pointer transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-50"></span>
            </div>
          </div>
        </header>

        {/* 1. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`font-heading text-4xl font-extrabold ${stat.valueColor || "text-slate-900"}`}>{stat.value}</span>
                <span className={`text-sm font-bold ${stat.subtextColor}`}>{stat.subtext}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Bento Layout: Feed & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Activity Feed (Spans 8 columns) */}
          <section className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading text-xl font-bold text-slate-900">Recent Activity</h3>
              <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
            </div>
            
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                    <activity.icon className={`w-6 h-6 ${activity.color}`} />
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-6">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-sans text-slate-900">
                        {activity.type === "request" && <><span className="font-bold">{activity.user}</span> requested your <span className="font-bold">{activity.item}</span></>}
                        {activity.type === "reminder" && <><span className="font-bold">Return reminder</span> for {activity.item}</>}
                        {activity.type === "success" && <><span className="font-bold">Booking Confirmed</span> for {activity.item}</>}
                      </p>
                      <span className="text-xs font-bold text-slate-400 shrink-0 ml-4">{activity.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{activity.details}</p>
                    
                    {/* Action buttons only show for requests */}
                    {activity.type === "request" && (
                      <div className="flex gap-3 mt-4">
                        <Button size="sm" className="rounded-xl font-bold px-6">Accept</Button>
                        <Button size="sm" variant="outline" className="rounded-xl font-bold px-6">Decline</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions & Returns (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Quick Actions (Dark Blue Box) */}
            <section className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-600/20">
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
                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10 group">
                  <span className="flex items-center gap-3 font-bold text-sm">
                    <Calendar className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" /> Manage Schedule
                  </span>
                  <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </section>

            {/* Upcoming Returns */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-6">Upcoming Returns</h3>
              <div className="space-y-4">
                {upcomingReturns.map((item) => (
                  <div key={item.id} className={`p-4 rounded-2xl flex items-center gap-4 ${item.urgent ? 'bg-rose-50 border border-rose-100' : 'bg-slate-50 border border-slate-100'}`}>
                    <img src={item.image} alt={item.item} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.item}</p>
                      <p className={`text-xs font-bold mt-1 ${item.urgent ? 'text-rose-600' : 'text-slate-500'}`}>{item.due}</p>
                    </div>
                    <Info className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 3. Top Performing Listings */}
        <section className="mt-12 mb-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="font-heading text-2xl font-bold text-slate-900">Your Top Performing Listings</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Based on rental frequency this month</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-200 group">
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-indigo-600 shadow-sm">
                    {listing.category}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-heading text-lg font-bold text-slate-900 mb-1">{listing.title}</h4>
                  <p className="text-xs font-bold text-slate-400 mb-6">Rented {listing.rentals} times this month</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-extrabold text-indigo-600 font-heading">${listing.price}</span>
                      <span className="text-sm font-bold text-slate-400">/day</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}