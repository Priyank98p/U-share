import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/context/ToastContext";
import {
  ChevronRight,
  Heart,
  ShieldCheck,
  CalendarDays,
  MessageSquare,
  Shield,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online"); // online | cash | upi
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/items/${id}`);
        const fetchedItem =
          response.data?.data?.item || response.data?.data || response.data;
        setItem(fetchedItem);
        setActiveImage(fetchedItem.images?.[0] || null);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        setError("Could not load item details. It may have been removed.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const isOwner =
    user && item && user._id === (item.ownerId?._id || item.ownerId);

  // Calculate rental info
  const diffDays =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
        )
      : 0;
  const rentalCost =
    diffDays > 0 ? diffDays * (item?.rentalPricePerDay || 0) : 0;
  const deposit = item?.depositAmount || 0;
  const totalPrice = rentalCost + deposit;

  // Today as YYYY-MM-DD for min date
  const today = new Date().toISOString().split("T")[0];

  // Load Razorpay script
  const loadRazorpay = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      const res = await axiosInstance.post(`/users/wishlist/${item._id}`);
      toast.success(res.data.message || "Wishlist updated!");
    } catch {
      toast.error("Error toggling wishlist");
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book an item");
      navigate("/login");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }
    if (diffDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setIsBooking(true);

      if (paymentMethod === "cash") {
        // Cash payment — directly create booking
        const res = await axiosInstance.post("/payment/verify", {
          itemId: id,
          startDate,
          endDate,
          totalPrice,
          paymentMethod: "cash",
        });
        setBookingSuccess(
          res.data.message || "Booking created! Awaiting owner approval.",
        );
        return;
      }

      // Online / UPI — Razorpay flow
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load Razorpay. Check your connection.");
        return;
      }

      const orderRes = await axiosInstance.post("/payment/create-order", {
        itemId: id,
        startDate,
        endDate,
      });
      const orderData = orderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "U-Share",
        description: `Rent: ${orderData.itemTitle}`,
        order_id: orderData.orderId,
        prefill: {
          name: user.fullname,
          email: user.email,
        },
        method:
          paymentMethod === "upi"
            ? { upi: true, card: false, netbanking: false, wallet: false }
            : undefined,
        handler: async (response) => {
          try {
            const verifyRes = await axiosInstance.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              itemId: id,
              startDate,
              endDate,
              totalPrice,
              paymentMethod: "online",
            });
            setBookingSuccess(
              verifyRes.data.message || "Payment successful! Booking created.",
            );
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setIsBooking(false);
    }
  };

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
        <Link to="/browse">
          <Button className="rounded-xl px-8 font-bold">Back to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 w-full animate-in fade-in duration-500">
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
        {/* Image Gallery */}
        <div className="lg:col-span-7 space-y-12 animate-in slide-in-from-left-8 fade-in duration-500 delay-100">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 group">
              <img
                src={
                  activeImage || "https://placehold.co/800x600?text=No+Image"
                }
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {!isOwner && (
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              )}
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

          {/* Description */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">
              Item Description
            </h2>
            <p className="font-sans text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </section>

          {/* Rental Rules */}
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
                    Please return the item in the condition it was given.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-5 animate-in slide-in-from-right-8 fade-in duration-500 delay-200">
          <div className="sticky top-24 space-y-6">
            {/* Title, badges, owner */}
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
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.ownerId?.fullname || "User"}`}
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
              </div>
            </div>

            {/* Pricing & Booking Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-indigo-600/5 border border-indigo-100/50 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-4xl font-extrabold text-emerald-600 font-heading">
                    ₹{item.rentalPricePerDay}
                  </span>
                  <span className="text-slate-500 font-bold"> / day</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                    Refundable Deposit
                  </p>
                  <p className="text-lg font-bold text-emerald-500">
                    ₹{deposit}
                  </p>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Rental Start
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          if (endDate && e.target.value >= endDate)
                            setEndDate("");
                        }}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                      />
                      <CalendarDays className="w-4 h-4 text-indigo-500 absolute right-4 top-4 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Return By
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || today}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                      />
                      <CalendarDays className="w-4 h-4 text-indigo-500 absolute right-4 top-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                {!isOwner && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "online", label: "Card", icon: CreditCard },
                        { key: "upi", label: "UPI", icon: Smartphone },
                        { key: "cash", label: "Cash", icon: Banknote },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPaymentMethod(key)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-sm font-bold ${
                            paymentMethod === key
                              ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              {diffDays > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 font-medium">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>
                      ₹{item.rentalPricePerDay} × {diffDays} days
                    </span>
                    <span>₹{rentalCost}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Refundable Deposit</span>
                    <span>₹{deposit}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between">
                    <span className="font-extrabold text-slate-900">Total</span>
                    <span className="font-extrabold text-emerald-500 text-lg">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {bookingSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700">
                  {bookingSuccess}
                </div>
              )}

              {/* Actions */}
              {!isOwner ? (
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    onClick={handleBooking}
                    disabled={
                      isBooking || !startDate || !endDate || diffDays <= 0
                    }
                    className="w-full h-14 rounded-2xl font-bold bg-indigo-600 text-white cursor-pointer text-lg shadow-lg shadow-indigo-500/30 disabled:opacity-50 transition-all active:scale-[0.98]"
                  >
                    {isBooking
                      ? "Processing..."
                      : paymentMethod === "cash"
                        ? "Book Now (Cash)"
                        : "Pay & Book Now"}
                  </Button>
                  <Link
                    to={`/messages?user=${item.ownerId?._id}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 rounded-2xl font-bold border-2 cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" /> Chat Owner
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <p className="text-sm font-bold text-amber-700">
                    This is your listing
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    You cannot rent or message yourself.
                  </p>
                </div>
              )}

              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isOwner ? "" : "You won't be charged until owner approves"}
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
                  All rentals are insured up to ₹10,000 for verified campus
                  members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
