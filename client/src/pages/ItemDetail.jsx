import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import {
  ChevronRight,
  Heart,
  Star,
  ShieldCheck,
  CalendarDays,
  Minus,
  Plus,
  MessageSquare,
  Shield,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

// Mock data for the similar items carousel so the page doesn't crash
const mockSimilarItems = [
  {
    id: "mock1",
    title: "Casio Scientific Calculator",
    category: "Academic Tools",
    price: 3,
    rating: 4.8,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&q=80",
  },
  {
    id: "mock2",
    title: "Graphing Calculator TI-84",
    category: "Academic Tools",
    price: 5,
    rating: 4.9,
    reviews: 8,
    image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&q=80",
  }
];

export default function ItemDetail() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(3); 
  const [similarItems] = useState(mockSimilarItems);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/items/${id}`);

        const fetchedItem =
          response.data?.data?.item || response.data?.data || response.data;
        
        setItem(fetchedItem);
        // Set the first image as the active large image when data loads
        setActiveImage(fetchedItem.images?.[0] || null);
        
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        setError("Could not load item details. It may have been removed.");
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-500">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-6">
        <AlertCircle className="w-16 h-16 text-rose-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Item Not Found
        </h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <Link to="/">
          <Button className="rounded-xl px-8 font-bold">Back to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 w-full">

      <nav className="flex items-center space-x-2 text-slate-400 text-sm mb-8 font-medium">
        <Link to="/browse" className="hover:text-indigo-500 transition-colors">
          Browse
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/browse" className="hover:text-indigo-500 transition-colors">
          {item.category}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-bold">{item.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        <div className="lg:col-span-7 space-y-12">
    
          <div className="space-y-4">
  
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
              <img
                src={activeImage || "https://placehold.co/800x600?text=No+Image"}
                alt={item.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-400 hover:text-rose-500 transition-colors">
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {item.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all ${activeImage === img ? "ring-2 ring-indigo-500 scale-95" : "hover:opacity-80 border border-slate-200"}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

  
          <section>
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">
              Item Description
            </h2>
            <p className="font-sans text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">
              Rental Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <ShieldCheck className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Handle with care
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Please keep the item secure when not in use.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <ShieldCheck className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Return Condition
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Please ensure the item is returned in the exact condition it was given.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Reviews
              </h2>
              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold text-slate-900">
                  5.0
                </span>
                <span className="text-slate-400 font-medium">
                  (1 review)
                </span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                      alt="Reviewer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">
                      Sarah Jenkins
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Last week
                    </p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
              <p className="text-slate-600 text-sm font-sans">
                Great to rent from! The gear was in perfect condition
                and the hand-off was super smooth on campus. Highly recommended.
              </p>
            </div>
          </section>
        </div>

  
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            
         
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-500 text-xs font-bold rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {item.condition}
                </span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-slate-900 leading-tight">
                {item.title}
              </h1>

              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.ownerId?.fullname || 'User'}`}
                    alt="Owner"
                    className="w-10 h-10 rounded-full border-2 border-slate-100"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <p className="font-bold text-sm text-slate-900">
                      
                        {item.ownerId?.fullname || "Student"}
                      </p>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-emerald-600 font-bold">
                      Verified Student
                    </p>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">
                    4.9 ★
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Owner Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing & Booking Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-4xl font-extrabold text-emerald-600 font-heading">
                    {/* 🚀 MAPPED: Changed from item.price to item.rentalPricePerDay */}
                    ₹{item.rentalPricePerDay}
                  </span>
                  <span className="text-slate-500 font-bold"> / day</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                    Refundable Deposit
                  </p>
                  <p className="text-lg font-bold text-emerald-500">
                    {/* 🚀 MAPPED: Changed from item.deposit to item.depositAmount */}
                    ₹{item.depositAmount}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-white p-4 space-y-1 hover:bg-slate-50 cursor-pointer transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Rental Start
                    </label>
                    <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                      <span>Oct 24, 2025</span>
                      <CalendarDays className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                  <div className="bg-white p-4 space-y-1 hover:bg-slate-50 cursor-pointer transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Return By
                    </label>
                    <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                      <span>Oct 27, 2025</span>
                      <CalendarDays className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                </div>

                {/* Quantity Interactive Selector */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-sm font-bold text-slate-600">
                    Quantity
                  </span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-slate-900 w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-100 font-medium">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>
                    ₹{item.rentalPricePerDay} x {rentalDays} days x {quantity} qty
                  </span>
                  <span>
                    {/* 🚀 MAPPED: Dynamic math based on MongoDB price and react state! */}
                    ₹{(item.rentalPricePerDay * rentalDays * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Service Fee</span>
                  <span>₹4.50</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <span className="font-extrabold text-slate-900">Total</span>
                  <span className="font-extrabold text-emerald-500 text-lg">
                    ₹{(item.rentalPricePerDay * rentalDays * quantity + 4.5).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full h-14 rounded-2xl font-bold bg-indigo-500 text-white cursor-pointer text-lg shadow-lg shadow-indigo-500/30"
                >
                  Rent Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 rounded-2xl font-bold border-2"
                >
                  <MessageSquare className="w-5 h-5 mr-2" /> Chat Owner
                </Button>
              </div>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                You won't be charged yet
              </p>
            </div>

            {/* Trust Badge */}
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Student Protection
                </h4>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  All rentals are insured up to $1,000 for verified campus
                  members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Items Carousel (Using mock data to prevent crash) */}
      <section className="mt-24 border-t border-slate-100 pt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900">
              Similar Listings
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Other gear available from students in your area
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarItems.map((similarItem) => (
            <Link
              to={`/item/${similarItem.id}`}
              key={similarItem.id}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all duration-300 border border-slate-100">
                <img
                  src={similarItem.image}
                  alt={similarItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {similarItem.category}
                  </span>
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-indigo-500 transition-colors">
                {similarItem.title}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="font-extrabold text-slate-900">
                  ₹{similarItem.price}/day
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}