import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <section className="hero-gradient overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* left side */}
        <div className="space-y-3">
          <div className="font-heading text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            <h1 className="text-5xl font-bold">Rent What You Need.</h1>
            <span className="text-5xl text-[#4F46E5] font-bold">
              Earn From What You Own.
            </span>
          </div>

          <p className="text-gray-500 text-xl py-8">
            The trusted campus-only marketplace where verified students share
            resources, save money, and earn extra cash on the side.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/browse">
            <Button className="bg-[#4F46E5] text-white px-6 py-6 text-md cursor-pointer rounded-3xl transition-all ease-in hover:scale-103">
              Browse rentals
            </Button>
            </Link>
            <Link to="/create-listing">
            <Button className="bg-slate-100 cursor-pointer hover:scale-103 hover:bg-emerald-300 text-md text-gray-600 border px-6 py-6 rounded-3xl">
              List an item
            </Button>
            </Link>
          </div>
        </div>

        {/* right side */}

        <div className="relative mt-10 lg:mt-0">
          {/* Background glowing blob */}
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl -z-10"></div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            {/* Left Column of Grid */}
            <div className="space-y-4">
              <div className="bg-white p-2 rounded-2xl shadow-xl hover:-rotate-2 transition-all duration-300 cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
                  alt="MacBook Pro"
                  className="rounded-xl w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-heading font-bold text-sm text-slate-900">
                    MacBook Pro M2
                  </p>
                  <p className="text-primary font-extrabold">₹500/day</p>
                </div>
              </div>

              <div className="bg-white p-2 rounded-2xl shadow-xl hover:rotate-2 transition-all duration-300 cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80"
                  alt="Textbooks"
                  className="rounded-xl w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-heading font-bold text-sm text-slate-900">
                    Bio 101 Textbooks
                  </p>
                  <p className="text-primary font-extrabold">₹100/day</p>
                </div>
              </div>
            </div>

            {/* Right Column of Grid */}
            <div className="space-y-4">
              <div className="bg-white p-2 rounded-2xl shadow-xl hover:rotate-3 transition-all duration-300 cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"
                  alt="Camera"
                  className="rounded-xl w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-heading font-bold text-sm text-slate-900">
                    Sony Alpha Kit
                  </p>
                  <p className="text-primary font-extrabold">₹200/day</p>
                </div>
              </div>

              <div className="bg-white p-2 rounded-2xl shadow-xl hover:-rotate-3 transition-all duration-300 cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                  alt="Headphones"
                  className="rounded-xl w-full  object-cover"
                />
                <div className="p-3">
                  <p className="font-heading font-bold text-sm text-slate-900">
                    Noise Cancel Pro
                  </p>
                  <p className="text-primary font-extrabold">₹200/day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
