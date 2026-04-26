import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import ItemCard from "@/components/ItemCard";
import { useToast } from "@/context/ToastContext";
import { Heart, Search, Trash2 } from "lucide-react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/users/wishlist");
        const data = res.data?.data?.wishlist || res.data?.data || [];
        setWishlist(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      await axiosInstance.post(`/users/wishlist/${itemId}`);
      setWishlist((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 w-full min-h-[calc(100vh-16rem)] animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900">Your Wishlist</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">{isLoading ? "Loading..." : `${wishlist.length} saved items`}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-[22rem] animate-pulse border border-slate-100 flex flex-col p-4">
              <div className="h-48 bg-slate-100 rounded-2xl mb-4"></div>
              <div className="h-4 bg-slate-100 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item, index) => (
            <div
              key={item._id}
              className="relative animate-in slide-in-from-bottom-8 fade-in duration-500"
              style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
            >
              <ItemCard item={item} />
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Heart className="w-10 h-10 text-rose-300" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 max-w-sm mb-8 font-medium">Save items you're interested in renting later by clicking the heart icon on any listing.</p>
          <Link to="/browse">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
              <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Browse Items</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
