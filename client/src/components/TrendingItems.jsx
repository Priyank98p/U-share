import { useEffect } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllItems } from "@/store/itemSlice";
const TrendingItems = () => {
  const dispatch = useDispatch();
  const { itemsList, isLoading, error } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchAllItems());
  }, [dispatch]);
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 w-full mb-24">
      <div className="flex items-center justify-between mb-12">
        <h2 className="font-heading text-3xl font-extrabold text-slate-900">
          Trending on Campus
        </h2>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Fetching latest gear...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-rose-50 rounded-2xl border border-rose-100">
          <p className="text-rose-500 font-bold">{error}</p>
        </div>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {itemsList.slice(0, 8).map((item) => (
            <Link to={`/item/${item._id}`}>
              <div
                key={item._id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-500 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div>
                      <span className="text-xl font-bold text-indigo-600">
                        ₹{item.rentalPricePerDay}
                      </span>
                      <span className="text-sm text-slate-500 font-bold">
                        /day
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-xl font-bold transition-colors"
                    >
                      Rent Now
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingItems;
