import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  PlusCircle,
  Eye,
  Repeat,
  Edit,
  Trash2,
  ImagePlus,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

// Mock Data for the user's listings
const initialListings = [
  {
    id: 1,
    title: "MacBook Air M1 - Silver (13-inch)",
    category: "Tech • Academic Tools",
    views: 248,
    rents: 12,
    price: 15.0,
    active: true,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80",
  },
  {
    id: 2,
    title: "Intro to Psychology (11th Ed)",
    category: "Textbooks • Psychology",
    views: 1042,
    rents: 34,
    price: 4.5,
    active: true,
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80",
  },
  {
    id: 3,
    title: "Graphing Calculator TI-84 Plus",
    category: "Math • Academic Tools",
    views: 156,
    rents: 5,
    price: 2.0,
    active: false, // This one is paused
    image:
      "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=300&q=80",
  },
];

const mockDrafts = [
  { id: 101, title: "Noise Cancelling Headphones", lastEdited: "2 hours ago" },
  { id: 102, title: "Electric Scooter (300W)", lastEdited: "Yesterday" },
];

export default function MyListings() {
  const [listings, setListings] = useState(initialListings);
  const [drafts, setDrafts] = useState(mockDrafts);
  const [showToast, setShowToast] = useState(true);

  // Toggle listing visibility
  const toggleVisibility = (id) => {
    setListings(
      listings.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  };

  // Delete listing simulation
  const deleteListing = (id) => {
    setListings(listings.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start">
      {/* 💻 SIDEBAR (Matches Dashboard) */}
      <aside className="hidden lg:flex w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex-col py-8 px-4 z-30">
        <div className="px-4 mb-8 flex flex-col items-start">
          <div className="h-16 w-16 rounded-full overflow-hidden mb-3 border-2 border-primary ring-4 ring-primary/10">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="Alex Rivera"
              className="h-full w-full object-cover bg-slate-100"
            />
          </div>
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Alex Rivera
          </h2>
          <div className="flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-500">
              Verified Student
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            to="/my-listings"
            className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-primary rounded-xl font-bold text-sm transition-colors"
          >
            <Package className="w-5 h-5" /> My Listings
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors"
          >
            <ShoppingCart className="w-5 h-5" /> Rentals
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors"
          >
            <MessageSquare className="w-5 h-5" /> Messages
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors"
          >
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <Link to="/create-listing">
          <Button className="mt-auto w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> New Listing
          </Button>
        </Link>
      </aside>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10 max-w-[1280px] w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 mb-2">
              My Listings
            </h1>
            <p className="text-slate-500 font-sans">
              Manage your available gear and track performance across campus.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex bg-slate-100 rounded-xl p-1 shrink-0">
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-xs font-bold text-primary">
                All Items
              </button>
              <button className="px-4 py-2 text-slate-500 text-xs font-bold hover:text-primary transition-colors">
                Active
              </button>
              <button className="px-4 py-2 text-slate-500 text-xs font-bold hover:text-primary transition-colors">
                History
              </button>
            </div>
            <Link to="/create-listing">
            <Button className="flex items-center gap-2 rounded-xl px-6 h-10 shadow-lg shadow-primary/20 shrink-0">
              <PlusCircle className="w-5 h-5" /> Create New Listing
            </Button>
            </Link>
          </div>
        </div>

        {/* Section: Active Listings */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Active Listings
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
              Live Now
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 shadow-sm border transition-all duration-300 ${item.active ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50/50"}`}
              >
                {/* Image */}
                <div
                  className={`w-full md:w-32 h-48 md:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 transition-all duration-300 ${!item.active && "grayscale opacity-60"}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details Grid */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-6 w-full">
                  {/* Info */}
                  <div
                    className={`md:col-span-4 ${!item.active && "opacity-60"}`}
                  >
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                      {item.category}
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />{" "}
                        {item.views.toLocaleString()} Views
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Repeat className="w-4 h-4" /> {item.rents} Rents
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    className={`md:col-span-2 text-left md:text-center ${!item.active && "opacity-60"}`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Price
                    </div>
                    <div className="font-heading text-lg font-extrabold text-primary">
                      ${item.price.toFixed(2)}
                      <span className="text-xs text-slate-400 font-bold">
                        /day
                      </span>
                    </div>
                  </div>

                  {/* Visibility Toggle */}
                  <div className="md:col-span-3 flex flex-row md:flex-col items-center justify-between md:justify-center gap-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden md:block">
                      Visibility
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-bold ${item.active ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {item.active ? "Active" : "Paused"}
                      </span>
                      {/* Custom Toggle Switch */}
                      <button
                        onClick={() => toggleVisibility(item.id)}
                        className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${item.active ? "bg-emerald-400" : "bg-slate-300"}`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${item.active ? "translate-x-6" : "translate-x-0"}`}
                        ></div>
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex justify-end gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteListing(item.id)}
                      className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <Button
                      variant={item.active ? "secondary" : "outline"}
                      className={`rounded-xl px-6 font-bold ${!item.active && "opacity-50 cursor-not-allowed"}`}
                    >
                      Stats
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Drafts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Drafts
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-primary text-[11px] font-bold rounded-full uppercase tracking-wider">
              Not Published
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 border-dashed hover:border-primary/40 transition-colors flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-primary transition-colors">
                  <ImagePlus className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-heading font-bold text-slate-900">
                    {draft.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Last edited {draft.lastEdited}
                  </p>
                  <div className="mt-3 flex gap-4">
                    <button className="text-primary text-xs font-bold hover:underline">
                      Complete Listing
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDrafts(drafts.filter((d) => d.id !== draft.id));
                      }}
                      className="text-rose-500 text-xs font-bold hover:underline"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Listing updated!</p>
            <p className="text-xs text-slate-300">
              Your changes have been saved successfully.
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="ml-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
