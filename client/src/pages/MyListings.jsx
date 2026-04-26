import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useToast } from "@/context/ToastContext";
import {
  Package, PlusCircle, Eye, Repeat, Edit, Trash2, Check, X
} from "lucide-react";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchMyInventory = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/items/my-items");
        const myItems = response.data?.data?.items || response.data?.data || response.data || [];
        setListings(Array.isArray(myItems) ? [...myItems].reverse() : []);
      } catch (err) {
        console.error("Failed to load inventory:", err);
        setError("Failed to load your listings. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyInventory();
  }, []);

  const deleteListing = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item permanently?");
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/items/${id}`);
      setListings(listings.filter((item) => item._id !== id));
      setToastMessage("Listing successfully deleted.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete the item.");
    }
  };

  const toggleVisibility = (id) => {
    setListings(listings.map(item =>
      item._id === id ? { ...item, isActive: !item.isActive } : item
    ));
    setToastMessage("Visibility updated.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-[1280px] w-full animate-in fade-in duration-500">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 mb-2">My Inventory</h1>
            <p className="text-slate-500 font-medium">Manage your available gear and track performance across campus.</p>
          </div>
          <Link to="/create-listing">
            <Button className="flex items-center gap-2 rounded-xl px-6 h-10 shadow-lg shadow-indigo-600/20">
              <PlusCircle className="w-5 h-5" /> Add New Item
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">Loading your inventory...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center">
            <p className="text-rose-500 font-bold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && listings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Your inventory is empty</h3>
            <p className="text-slate-500 mb-6">You haven't listed any items for rent yet.</p>
            <Link to="/create-listing">
              <Button className="rounded-xl px-8 font-bold">Create Your First Listing</Button>
            </Link>
          </div>
        )}

        {/* Items List */}
        {!isLoading && !error && listings.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight">Your Items</h2>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
                {listings.length} Total
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {listings.map((item, index) => (
                <div
                  key={item._id}
                  className={`bg-white rounded-3xl p-4 flex flex-col md:flex-row items-center gap-6 shadow-sm border transition-all duration-300 hover:shadow-md animate-in slide-in-from-bottom-4 fade-in duration-300 ${item.isActive !== false ? 'border-slate-200' : 'border-dashed border-slate-300 bg-slate-50/50'}`}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  {/* Image */}
                  <div className={`w-full md:w-32 h-48 md:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 transition-all duration-300 ${item.isActive === false && 'grayscale opacity-60'}`}>
                    <img src={item.images?.[0] || "https://placehold.co/300x300?text=No+Image"} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Details Grid */}
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-6 w-full">

                    {/* Info */}
                    <div className={`md:col-span-5 ${item.isActive === false && 'opacity-60'}`}>
                      <h3 className="font-heading font-bold text-lg text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-slate-500 mb-3">{item.category}</p>
                      <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> 0 Views</div>
                        <div className="flex items-center gap-1.5"><Repeat className="w-4 h-4" /> 0 Rents</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className={`md:col-span-2 text-left md:text-center ${item.isActive === false && 'opacity-60'}`}>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Price</div>
                      <div className="font-heading text-lg font-extrabold text-indigo-600">
                        ₹{item.rentalPricePerDay}<span className="text-xs text-slate-400 font-bold">/day</span>
                      </div>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="md:col-span-2 flex flex-row md:flex-col items-center justify-between md:justify-center gap-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden md:block">Visibility</div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${item.isActive !== false ? 'text-slate-900' : 'text-slate-400'}`}>
                          {item.isActive !== false ? 'Active' : 'Paused'}
                        </span>
                        <button
                          onClick={() => toggleVisibility(item._id)}
                          className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${item.isActive !== false ? 'bg-emerald-400' : 'bg-slate-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${item.isActive !== false ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-3 flex justify-end items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <Link to={`/item/${item._id}`}>
                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="View Public Page">
                          <Eye className="w-5 h-5" />
                        </button>
                      </Link>
                      <button className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all" title="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteListing(item._id)}
                        className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-4 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}