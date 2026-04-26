import { Link } from "react-router-dom";
import { 
  Heart, Star, ShieldCheck, CalendarDays, 
  ListFilter, SlidersHorizontal, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data representing the Search Results
const searchResults = [
  {
    id: "1",
    title: "MacBook Air M2 - 13\"",
    price: 12,
    deposit: 100,
    rating: 4.9,
    reviews: 24,
    verified: true,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
  },
  {
    id: "2",
    title: "Canon EOS R6 Mark II",
    price: 25,
    deposit: 250,
    rating: 4.8,
    reviews: 18,
    verified: true,
    category: "Photography",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
  },
  {
    id: "3",
    title: "Anatomy Bundle (Set of 3)",
    price: 5,
    deposit: 20,
    rating: 5.0,
    reviews: 8,
    verified: true,
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80"
  },
  {
    id: "4",
    title: "Sony WH-1000XM5 Headphones",
    price: 8,
    deposit: 50,
    rating: 4.7,
    reviews: 12,
    verified: true,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80"
  },
  {
    id: "5",
    title: "Ergonomic Office Chair",
    price: 4,
    deposit: 40,
    rating: 4.6,
    reviews: 5,
    verified: true,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80"
  },
  {
    id: "6",
    title: "Portable 4K Projector",
    price: 15,
    deposit: 120,
    rating: 4.9,
    reviews: 31,
    verified: true,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1585776269131-0941d3b9e4f5?w=800&q=80"
  }
];

export default function Browse() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 w-full">
      
      {/* 📱 MOBILE ONLY: Horizontal Category Scroller */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4 scrollbar-hide">
        <button className="px-5 py-2 bg-primary text-white rounded-full text-sm font-bold whitespace-nowrap">All Items</button>
        <button className="px-5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-bold whitespace-nowrap transition-colors">Textbooks</button>
        <button className="px-5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-bold whitespace-nowrap transition-colors">Electronics</button>
        <button className="px-5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-bold whitespace-nowrap transition-colors">Furniture</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* 💻 DESKTOP ONLY: Left Sidebar Filters */}
        <aside className="hidden md:block col-span-3 space-y-8 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Categories */}
          <div>
            <h3 className="font-heading font-bold text-slate-900 mb-4">Category</h3>
            <div className="space-y-3">
              {['Electronics', 'Textbooks', 'Study Gear', 'Furniture'].map((cat, i) => (
                <label key={i} className="flex items-center gap-3 group cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
                  <span className="text-sm text-slate-600 group-hover:text-primary font-medium transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-slate-900">Price per day</h3>
              <span className="text-xs font-bold text-primary">$0 - $50+</span>
            </div>
            <input type="range" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>

          {/* Dates */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-heading font-bold text-slate-900 mb-4">Availability dates</h3>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Select dates" className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium" />
            </div>
          </div>

          {/* Condition Pills */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-heading font-bold text-slate-900 mb-4">Condition</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-indigo-50 text-primary text-xs font-bold rounded-full border border-indigo-100 cursor-pointer">Brand New</span>
              <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-xs font-bold rounded-full border border-slate-200 hover:border-indigo-200 cursor-pointer transition-colors">Like New</span>
              <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-xs font-bold rounded-full border border-slate-200 hover:border-indigo-200 cursor-pointer transition-colors">Good</span>
            </div>
          </div>
        </aside>

        {/* 📱 & 💻 MAIN FEED: Listings Grid */}
        <div className="col-span-1 md:col-span-9">
          
          {/* Feed Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900">Featured Rentals</h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">Showing 152 items available near your campus</p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:border-primary hover:text-primary transition-colors">
              <ListFilter className="w-4 h-4" /> 
              Sort: Popular
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((item) => (
              <Link to={`/item/${item.id}`} key={item.id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full">
                  
                  {/* Image & Action Buttons */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        Available
                      </span>
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm z-10" onClick={(e) => e.preventDefault()}>
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h2 className="font-heading font-bold text-lg text-slate-900 line-clamp-1">{item.title}</h2>
                      <div className="flex items-center bg-indigo-50 px-2 py-1 rounded-lg shrink-0">
                        <Star className="w-3 h-3 text-primary fill-current mr-1" />
                        <span className="text-xs font-bold text-primary">{item.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {item.verified && (
                        <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          VERIFIED STUDENT
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Price & Deposit/Button */}
                    <div className="pt-4 border-t border-slate-50 mt-auto flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Price</p>
                        <p className="font-heading font-extrabold text-primary text-2xl leading-none">
                          ${item.price}<span className="text-sm font-bold text-slate-400">/day</span>
                        </p>
                      </div>
                      
                      {/* Responsive Action: Deposit on Desktop, Button on Mobile */}
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Deposit</p>
                        <p className="text-sm font-bold text-slate-600">${item.deposit}</p>
                      </div>
                      <div className="sm:hidden">
                        <Button size="sm" className="rounded-xl font-bold px-6">Rent Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center space-x-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-md">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-primary hover:text-primary transition-all">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-primary hover:text-primary transition-all">3</button>
            <span className="px-2 text-slate-400 font-bold">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-primary hover:text-primary transition-all">8</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* 📱 MOBILE ONLY: Floating Filter Action Button */}
      <button className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl z-40 active:scale-95 transition-transform border border-slate-700">
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-bold text-sm">Filters</span>
      </button>

    </div>
  );
}