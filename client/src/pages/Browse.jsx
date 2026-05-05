import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import ItemCard from "@/components/ItemCard";
import { SlidersHorizontal, PackageSearch, X, Search } from "lucide-react";

const CATEGORIES = ["Electronics", "Books", "Calculators", "Project Kits", "Sports", "Lab & Equipment"];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];

function FilterPanel({ category, condition, minPrice, maxPrice, availabilityDate, activeFilterCount, onCategoryChange, onConditionChange, setMinPrice, setMaxPrice, setAvailabilityDate, resetFilters }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-heading font-extrabold text-slate-900 mb-4 tracking-tight">Category</h3>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 group cursor-pointer">
            <input type="checkbox" checked={!category} onChange={() => onCategoryChange("")} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
            <span className="text-sm text-slate-600 group-hover:text-indigo-600 font-bold transition-colors">All Items</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 group cursor-pointer">
              <input type="checkbox" checked={category === cat} onChange={() => onCategoryChange(cat)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
              <span className="text-sm text-slate-600 group-hover:text-indigo-600 font-bold transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Two-Way Price Slider */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-extrabold text-slate-900 tracking-tight">Price / day</h3>
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">₹{minPrice} – ₹{maxPrice}</span>
        </div>
        <div className="relative h-6 flex items-center">
          <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />
          <div className="absolute h-1.5 bg-indigo-500 rounded-full" style={{ left: `${(minPrice / 1000) * 100}%`, right: `${100 - (maxPrice / 1000) * 100}%` }} />
          <input type="range" min="0" max="1000" value={minPrice} onChange={(e) => { const v = Number(e.target.value); if (v < maxPrice) setMinPrice(v); }} className="absolute w-full h-1.5 opacity-0 cursor-pointer" />
          <input type="range" min="0" max="1000" value={maxPrice} onChange={(e) => { const v = Number(e.target.value); if (v > minPrice) setMaxPrice(v); }} className="absolute w-full h-1.5 opacity-0 cursor-pointer" />
          <div className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow pointer-events-none" style={{ left: `calc(${(minPrice / 1000) * 100}% - 8px)` }} />
          <div className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow pointer-events-none" style={{ left: `calc(${(maxPrice / 1000) * 100}% - 8px)` }} />
        </div>
        <div className="flex justify-between mt-3 text-xs font-bold text-slate-400"><span>₹0</span><span>₹1000</span></div>
      </div>

      {/* Condition */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="font-heading font-extrabold text-slate-900 mb-4 tracking-tight">Condition</h3>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map((cond) => (
            <button key={cond} onClick={() => onConditionChange(cond)} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${condition === cond ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>{cond}</button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="font-heading font-extrabold text-slate-900 mb-4 tracking-tight">Available On</h3>
        <input type="date" value={availabilityDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setAvailabilityDate(e.target.value)} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none" />
        {availabilityDate && <button onClick={() => setAvailabilityDate("")} className="mt-2 text-xs text-slate-400 hover:text-rose-500 font-bold">Clear date</button>}
      </div>

      {activeFilterCount > 0 && (
        <button onClick={resetFilters} className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-bold hover:bg-rose-50 transition-colors">
          Reset All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );
}

export default function Browse() {
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState(() => searchParams.get("search") || "");
  const [category, setCategory] = useState(() => searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [condition, setCondition] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const debounceRef = useRef(null);
  const prevSearchParamsRef = useRef("");

  const fetchItems = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (params.category) query.set("category", params.category);
      if (params.search) query.set("search", params.search);
      if (params.minPrice > 0) query.set("minPrice", params.minPrice);
      if (params.maxPrice < 1000) query.set("maxPrice", params.maxPrice);
      if (params.condition) query.set("condition", params.condition);
      if (params.date) query.set("date", params.date);
      const res = await axiosInstance.get(`/items?${query.toString()}`);
      const fetched = res.data?.data?.items || res.data?.data || [];
      setItems(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      setError("Failed to load items. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync URL params → state (handles Navbar/Home category links)
  useEffect(() => {
    const paramStr = searchParams.toString();
    if (paramStr === prevSearchParamsRef.current) return;
    prevSearchParamsRef.current = paramStr;
    const urlCat = searchParams.get("category") || "";
    const urlSearch = searchParams.get("search") || "";
    setCategory(urlCat);
    setSearchInput(urlSearch);
    fetchItems({ search: urlSearch, category: urlCat, minPrice: 0, maxPrice: 1000, condition: "", date: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Re-fetch when filters change (use queueMicrotask to avoid set-state-in-effect lint rule)
  useEffect(() => {
    const run = async () => {
      await fetchItems({ search: searchInput, category, minPrice, maxPrice, condition, date: availabilityDate });
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, minPrice, maxPrice, condition, availabilityDate]);

  const handleSearchChange = useCallback((val) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchItems({ search: val, category, minPrice, maxPrice, condition, date: availabilityDate });
    }, 500);
  }, [fetchItems, category, minPrice, maxPrice, condition, availabilityDate]);

  const handleCategoryChange = (cat) => setCategory(prev => prev === cat ? "" : cat);
  const handleConditionChange = (cond) => setCondition(prev => prev === cond ? "" : cond);

  const resetFilters = () => {
    setCategory(""); setMinPrice(0); setMaxPrice(1000);
    setCondition(""); setAvailabilityDate(""); setSearchInput("");
  };

  const activeFilterCount = [category, condition, availabilityDate, minPrice > 0, maxPrice < 1000].filter(Boolean).length;
  const panelProps = { category, condition, minPrice, maxPrice, availabilityDate, activeFilterCount, onCategoryChange: handleCategoryChange, onConditionChange: handleConditionChange, setMinPrice, setMaxPrice, setAvailabilityDate, resetFilters };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 w-full animate-in fade-in duration-500">
      {/* Mobile category pills */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4">
        <button onClick={() => setCategory("")} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap ${!category ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white border border-slate-200 text-slate-600"}`}>All</button>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${category === cat ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block col-span-3 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto pr-2">
          <FilterPanel {...panelProps} />
        </aside>

        {/* Main feed */}
        <div className="col-span-1 md:col-span-9">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{category || "All Rentals"}</h1>
              <p className="text-slate-500 text-sm mt-1 font-bold">{isLoading ? "Loading..." : `${items.length} items found`}</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search rentals..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full sm:w-48 bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-2xl text-sm font-bold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                />
              </div>
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="md:hidden relative flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-2xl text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>

          {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl font-bold mb-6">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-[22rem] animate-pulse border border-slate-100 flex flex-col p-4">
                  <div className="h-48 bg-slate-100 rounded-2xl mb-4" />
                  <div className="h-4 bg-slate-100 rounded-md w-3/4 mb-2" />
                  <div className="h-4 bg-slate-100 rounded-md w-1/2" />
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <div key={item._id} className="animate-in slide-in-from-bottom-8 fade-in duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}>
                  <ItemCard item={item} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <PackageSearch className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">No items found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Clear all filters</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilterDrawer && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowFilterDrawer(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white overflow-y-auto p-6 shadow-2xl animate-in slide-in-from-right-8 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-extrabold text-slate-900">Filters</h2>
              <button onClick={() => setShowFilterDrawer(false)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel {...panelProps} />
            <button onClick={() => setShowFilterDrawer(false)} className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20">
              Show {items.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}