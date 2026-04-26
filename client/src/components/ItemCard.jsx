import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

function ItemCard({ item, className }) {
  if (!item) return null;

  return (
    <Link to={`/item/${item._id}`} className={cn("group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]", className)}>
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={item.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-heading font-bold text-slate-900 line-clamp-1">{item.title}</h3>
          <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-xs font-medium">{item.ownerId?.rating || "New"}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
          {item.description}
        </p>

        <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Rental Price</p>
            <p className="text-lg font-bold text-indigo-600">
              ₹{item.rentalPricePerDay}
              <span className="text-sm font-normal text-slate-500">/day</span>
            </p>
          </div>
          
          {item.ownerId?.department && (
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[80px]">{item.ownerId.department}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
