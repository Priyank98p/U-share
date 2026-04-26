import { Link } from "react-router-dom";
import {
  ArrowRight,
  Laptop,
  BookOpen,
  Microscope,
  Search,CalendarDays,RefreshCcw
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import TrendingItems from "@/components/TrendingItems";

const Home = () => {
  return (
    <div className="flex flex-col w-full">
     <HeroSection />

      <section className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900">
              Explore by Category
            </h2>
            <p className="text-slate-600 mt-2 font-sans">
              Find exactly what you need for your next project or class.
            </p>
          </div>
          <Link
            to="#"
            className="text-primary font-bold flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Electronics (Spans 2 columns) */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-2xl bg-slate-950 aspect-video md:aspect-auto w-full h-full min-h-62.5 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
              alt="Electronics"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 z-10">
              <Laptop className="text-white w-10 h-10 mb-4 drop-shadow-md" />
              <h3 className="text-2xl font-bold text-white font-heading drop-shadow-md">
                Electronics
              </h3>
              <p className="text-slate-200 text-sm font-sans drop-shadow-md">
                Laptops, cameras, and drones
              </p>
            </div>
          </div>

          {/* Books */}
          <div className="group relative overflow-hidden rounded-2xl bg-slate-950 aspect-square cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80"
              alt="Books"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <BookOpen className="text-amber-400 w-10 h-10 drop-shadow-md" />
              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white font-heading drop-shadow-md">
                  Books
                </h3>
                <p className="text-slate-200 text-sm font-sans drop-shadow-md">
                  Academic & fiction
                </p>
              </div>
            </div>
          </div>

          {/* Lab Kits (Spans 2 columns) */}
          <div className="md:col-span-3 group relative overflow-hidden rounded-2xl bg-slate-950 aspect-video md:aspect-auto min-h-50 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Lab Equipment"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex items-center gap-8 z-10">
              <Microscope className="text-indigo-400 w-16 h-16 drop-shadow-md" />
              <div>
                <h3 className="text-2xl font-bold text-white font-heading drop-shadow-md">
                  Lab & Equipment
                </h3>
                <p className="text-slate-200 font-sans drop-shadow-md">
                  Specialized tools for STEM majors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F3FF] py-24 w-full border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-extrabold text-[#4F46E5]">How U-Share Works</h2>
            <p className="text-slate-600 mt-4 font-sans max-w-2xl mx-auto">
              Rent anything from your fellow students in three simple, secure steps.
            </p>
          </div>

       
          <div className="grid md:grid-cols-3 gap-12">
      
            <div className="text-center group flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">1. Search</h3>
              <p className="text-slate-600 font-sans text-sm leading-relaxed max-w-70">
                Browse listings from verified students on your campus. Use filters to find the perfect match.
              </p>
            </div>

            <div className="text-center group flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                <CalendarDays className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">2. Rent</h3>
              <p className="text-slate-600 font-sans text-sm leading-relaxed max-w-70">
                Select your dates, book through our secure platform, and arrange a convenient campus pickup.
              </p>
            </div>

        
            <div className="text-center group flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                <RefreshCcw className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">3. Return</h3>
              <p className="text-slate-600 font-sans text-sm leading-relaxed max-w-70">
                Meet back at the designated spot to return the item. Rate your experience to keep the community safe.
              </p>
            </div>

          </div>
        </div>
      </section>

      <TrendingItems />
    </div>
  );
};

export default Home;
