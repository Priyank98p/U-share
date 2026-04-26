import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Laptop, BookOpen, Microscope, Search, CalendarDays, RefreshCcw, Star, Quote
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import TrendingItems from "@/components/TrendingItems";
import axiosInstance from "@/api/axiosInstance";

const Home = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get("/reviews/recent");
        setReviews(res.data?.data || []);
      } catch {
        /* silent — reviews are optional */
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <HeroSection />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex justify-between items-end mb-12 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">
          <div>
            <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900">Explore by Category</h2>
            <p className="text-slate-500 mt-2 font-medium">Find exactly what you need for your next project or class.</p>
          </div>
          <Link to="/browse" className="text-indigo-600 font-bold flex items-center gap-1 group hover:text-indigo-700 transition-colors">
            View all <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link to="/browse?category=Electronics" className="md:col-span-4 group relative overflow-hidden rounded-2xl bg-slate-950 aspect-video md:aspect-auto w-full h-full min-h-[250px] cursor-pointer">
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80" alt="Electronics" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 z-10">
              <Laptop className="text-white w-10 h-10 mb-4 drop-shadow-md" />
              <h3 className="text-2xl font-bold text-white font-heading drop-shadow-md">Electronics</h3>
              <p className="text-slate-200 text-sm font-sans drop-shadow-md">Laptops, cameras, and drones</p>
            </div>
          </Link>

          <Link to="/browse?category=Books" className="group relative overflow-hidden rounded-2xl bg-slate-950 aspect-square cursor-pointer">
            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80" alt="Books" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <BookOpen className="text-amber-400 w-10 h-10 drop-shadow-md" />
              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white font-heading drop-shadow-md">Books</h3>
                <p className="text-slate-200 text-sm font-sans drop-shadow-md">Academic & fiction</p>
              </div>
            </div>
          </Link>

          <Link to="/browse?category=Lab+%26+Equipment" className="md:col-span-3 group relative overflow-hidden rounded-2xl bg-slate-950 aspect-video md:aspect-auto min-h-[200px] cursor-pointer">
            <img src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?q=80&w=1170" alt="Lab Equipment" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex items-center gap-8 z-10">
              <Microscope className="text-indigo-400 w-16 h-16 drop-shadow-md" />
              <div>
                <h3 className="text-2xl font-bold text-white font-heading drop-shadow-md">Lab & Equipment</h3>
                <p className="text-slate-200 font-sans drop-shadow-md">Specialized tools for STEM majors</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-24 w-full border-y border-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-3xl"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/20 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <h2 className="font-heading text-3xl md:text-4xl font-black tracking-tight text-indigo-900">How U-Share Works</h2>
            <p className="text-slate-500 mt-4 font-medium max-w-2xl mx-auto text-lg">Rent anything from your fellow students in three simple, secure steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Search, title: "1. Search", desc: "Browse listings from verified students on your campus. Use filters to find the perfect match.", delay: "delay-100" },
              { icon: CalendarDays, title: "2. Rent", desc: "Select your dates, book through our secure platform, and arrange a convenient campus pickup.", delay: "delay-200" },
              { icon: RefreshCcw, title: "3. Return", desc: "Meet back at the designated spot to return the item. Rate your experience to keep the community safe.", delay: "delay-300" },
            ].map(({ icon: Icon, title, desc, delay }) => (
              <div key={title} className={`text-center group flex flex-col items-center animate-in slide-in-from-bottom-12 fade-in duration-700 ${delay}`}>
                <div className="w-20 h-20 bg-white/80 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/10 border border-slate-100 group-hover:-translate-y-2 group-hover:shadow-indigo-600/20 transition-all duration-300">
                  <Icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrendingItems />

      {/* Student Reviews */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-black tracking-tight text-slate-900">What Students Say</h2>
            <p className="text-slate-500 mt-4 font-medium text-lg">Real reviews from real campus members.</p>
          </div>

          {reviews.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Arjun Mehta", dept: "Computer Science, 3rd Year", rating: 5, text: "Rented a scientific calculator for my exams. Saved so much money compared to buying one. The owner was super friendly!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun" },
                { name: "Priya Sharma", dept: "Electronics, 2nd Year", rating: 5, text: "Listed my old laptop and got requests within hours. U-Share made it so easy to earn from gear I wasn't using.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
                { name: "Rohit Verma", dept: "Mechanical, 4th Year", rating: 4, text: "The chat feature makes coordination with the owner very smooth. Picked up a project kit for my final year project.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohit" },
              ].map((review) => (
                <ReviewCard key={review.name} review={{ reviewerId: { fullname: review.name, avatar: review.avatar, department: review.dept }, rating: review.rating, comment: review.text }} isStatic />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

function ReviewCard({ review, isStatic = false }) {
  const reviewer = review.reviewerId;
  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Quote className="w-8 h-8 text-indigo-200 mb-4 shrink-0" />
      <p className="text-slate-600 font-medium leading-relaxed text-sm flex-1 mb-6 italic">
        "{review.comment}"
      </p>
      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
        <img
          src={reviewer?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${reviewer?.fullname}`}
          alt={reviewer?.fullname}
          className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover"
        />
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-sm">{reviewer?.fullname || "Anonymous"}</p>
          <p className="text-xs text-slate-400 font-medium">{isStatic ? reviewer?.department : `${reviewer?.department || ""} · ${reviewer?.year ? reviewer.year + " Year" : ""}`}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
