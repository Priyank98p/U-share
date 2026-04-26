import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/api/axiosInstance";
import {
  CloudUpload,
  ImagePlus,
  Sparkles,
  ThumbsUp,
  Edit3,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Add brand to the schema so Zod knows it exists
const listingSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  brand: z.string().min(2, { message: "Brand must be at least 2 characters." }), // <-- ADDED THIS
  category: z.string().min(1, { message: "Please select a category." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
  price: z.coerce.number().min(1, { message: "Price must be at least $1." }),
  deposit: z.coerce.number().min(0, { message: "Deposit cannot be negative." }),
});

export default function CreateListing() {
  const navigate = useNavigate();
  const [condition, setCondition] = useState("Good");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [visible, setVisible] = useState("1");

  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: { price: 0, deposit: 0 },
  });

  // Calculate earnings based on watched price field
  const priceValue = useWatch({ control, name: "price" }) || 0;
  const estimatedWeeklyEarnings = (priceValue * 7).toFixed(2);
  const serviceFee = (estimatedWeeklyEarnings * 0.05).toFixed(2);
  const totalEarnings = (estimatedWeeklyEarnings - serviceFee).toFixed(2);

  const onSubmit = async (data) => {
    if (!imageFile) {
      setApiError("Please upload at least one photo of your item");
      return; // <-- ADDED: This stops the function from proceeding!
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("brand", data.brand); // Good addition!
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("rentalPricePerDay", data.price);
      formData.append("depositAmount", data.deposit);
      formData.append("condition", condition);

      // FIXED: Use the state variable `imageFile`, NOT `data.imageFile`
      formData.append("images", imageFile);

      const response = await axiosInstance.post("/items/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Backend success response:", response.data);
      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/my-listing");
      }, 2000);
    } catch (error) {
      console.log("Upload failed", error);
      setIsSubmitting(false);
      setApiError(
        error.response?.data?.message || "Failed to create listing! Try again",
      );
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* LEFT SIDEBAR: Stepper Navigation */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <h1 className="font-heading text-3xl font-extramedium text-slate-900">
              List an Item
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Complete these steps to make your item available to other students
              on campus.
            </p>

            <div className="space-y-4 pt-4">
  
              <div
                onClick={() => setVisible("1")}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer border-indigo-600/20 ${visible === "1" ? "bg-indigo-50" : "bg-white"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full text-slate-400 flex items-center justify-center font-medium text-sm shrink-0 ${visible === "1" ? "bg-indigo-600 text-white " : "bg-slate-100"}`}
                >
                  1
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-medium text-sm ${visible === "1" ? "text-indigo-600" : "text-slate-900"}`}
                  >
                    Details
                  </span>
                  <span className="text-xs text-slate-500">
                    Photos & Description
                  </span>
                </div>
              </div>

              <div
                onClick={() => setVisible("2")}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer border-indigo-600/20 ${visible === "2" ? "bg-indigo-50" : "bg-white"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full text-slate-400 flex items-center justify-center font-medium text-sm shrink-0 ${visible === "2" ? "bg-indigo-600 text-white " : "bg-slate-100"}`}
                >
                  2
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-medium text-sm ${visible === "2" ? "text-indigo-600" : "text-slate-900"}`}
                  >
                    Pricing
                  </span>
                  <span className="text-xs text-slate-500">
                    Rates & Deposit
                  </span>
                </div>
              </div>

              <div
                onClick={() => setVisible("3")}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer border-indigo-600/20 ${visible === "3" ? "bg-indigo-50" : "bg-white"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full text-slate-400 flex items-center justify-center font-medium text-sm shrink-0 ${visible === "3" ? "bg-indigo-600 text-white " : "bg-slate-100"}`}
                >
                  3
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-medium text-sm ${visible === "3" ? "text-indigo-600" : "text-slate-900"}`}
                  >
                    Availability
                  </span>
                  <span className="text-xs text-slate-500">
                    Dates & Location
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN FORM CONTENT */}
        <div className="col-span-1 lg:col-span-9">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {apiError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-rose-700">{apiError}</p>
              </div>
            )}
            {/* Item Details */}
            {visible === "1" && (
              <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl font-medium text-slate-900">
                    Item Details
                  </h2>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full uppercase tracking-wider">
                    Step 1 of 3
                  </span>
                </div>

                <div className="space-y-8">
                  {/* Photo Upload */}
                  <div>
                    <label className="block font-medium text-slate-900 mb-3">
                      Item Photos
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    <label
                      htmlFor="imageUpload"
                      className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:border-indigo-600 hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {imageFile ? (
                          <ImagePlus className="w-8 h-8 text-indigo-600" />
                        ) : (
                          <CloudUpload className="w-8 h-8 text-indigo-600" />
                        )}
                      </div>

                      <p className="font-medium text-slate-900 text-center">
                        {imageFile
                          ? `Selected: ${imageFile.name}`
                          : "Click to upload or drag and drop"}
                      </p>

                      {!imageFile && (
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          PNG, JPG or WEBP (Max 10MB per file)
                        </p>
                      )}
                      <div className="mt-6 flex gap-3">
                        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                          <ImagePlus className="w-6 h-6" />
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                          <ImagePlus className="w-6 h-6" />
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Title & Category Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium text-slate-900">
                        Item Title
                      </label>
                      <Input
                        placeholder="Enter title here"
                        className="h-12 rounded-xl bg-slate-50 border-slate-200"
                        {...register("title")}
                      />
                      {errors.title && (
                        <p className="text-xs text-rose-500 font-medium">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block font-medium text-slate-900">
                        Brand
                      </label>
                      <Input
                        placeholder="Enter brand here"
                        className="h-12 rounded-xl bg-slate-50 border-slate-200"
                        {...register("brand")}
                      />
                      {errors.brand && (
                        <p className="text-xs text-rose-500 font-medium">
                          {errors.brand.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block font-medium text-slate-900">
                        Category
                      </label>
                      <select
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-slate-700"
                        {...register("category")}
                      >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Calculators">Calculators</option>
                        <option value="Project Kits">Project Kits</option>
                        <option value="Sports">Sports</option>
                        <option value="Lab & Equipment">Lab & Equipment</option>
                      </select>
                      {errors.category && (
                        <p className="text-xs text-rose-500 font-medium">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block font-medium text-slate-900">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none resize-none font-medium text-slate-700 placeholder:text-slate-400"
                      placeholder="Describe the item, including any specific features or requirements..."
                      {...register("description")}
                    ></textarea>
                    {errors.description && (
                      <p className="text-xs text-rose-500 font-medium">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Condition Custom Radio Group */}
                  <div className="space-y-3">
                    <label className="block font-medium text-slate-900">
                      Condition
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setCondition("New")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${condition === "New" ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"}`}
                      >
                        <Sparkles className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">New</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCondition("Good")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${condition === "Good" ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"}`}
                      >
                        <ThumbsUp className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Good</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCondition("Fair")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${condition === "Fair" ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"}`}
                      >
                        <Edit3 className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Fair</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Pricing */}
            {visible === "2" && (
              <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl font-medium text-slate-900 mb-">
                    Pricing
                  </h2>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full uppercase tracking-wider">
                    Step 2 of 3
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block font-medium text-slate-900">
                        Price per Day
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">
                          ₹
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          className="h-12 pl-8 rounded-xl bg-slate-50 border-slate-200 font-medium"
                          placeholder="0.00"
                          {...register("price")}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-xs text-rose-500 font-medium">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block font-medium text-slate-900">
                        Security Deposit
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">
                          ₹
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          className="h-12 pl-8 rounded-xl bg-slate-50 border-slate-200 font-medium"
                          placeholder="0.00"
                          {...register("deposit")}
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Refunded to student upon safe return of item.
                      </p>
                    </div>
                  </div>

                  {/* Earnings Estimate Calculator */}
                  <div className="p-6 bg-indigo-100 rounded-2xl flex flex-col justify-between text-black shadow-xl">
                    <div>
                      <h4 className="font-medium mb-1">Earnings Estimate</h4>
                      <p className="text-xs text-slate-600 mb-6 font-medium">
                        Based on a typical 7-day rental period.
                      </p>

                      <div className="flex justify-between items-center py-3 border-b border-slate-400">
                        <span className="text-sm font-medium">
                          7 Days Rental
                        </span>
                        <span className="font-medium">
                          ₹{estimatedWeeklyEarnings}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-400 text-rose-500">
                        <span className="text-sm font-medium">
                          Service Fee (5%)
                        </span>
                        <span className="font-medium">-₹{serviceFee}</span>
                      </div>
                      <div className="flex justify-between items-center pt-5">
                        <span className="font-medium text-indigo-500">
                          Your Total Earnings
                        </span>
                        <span className="text-2xl font-heading font-extramedium text-indigo-500">
                          ₹{totalEarnings}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Availability & Location */}
            {visible === "3" && (
              <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl font-medium text-slate-900 ">
                    Availability & Pickup
                  </h2>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full uppercase tracking-wider">
                    Step 3 of 3
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  {/* Mock Calendar */}
                  <div className="space-y-4">
                    <label className="block font-medium text-slate-900">
                      Available Dates
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4 px-2">
                        <button
                          type="button"
                          className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="font-medium text-sm text-slate-900">
                          October 2025
                        </span>
                        <button
                          type="button"
                          className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                          <div
                            key={d}
                            className="text-[10px] font-medium text-slate-400"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        <div className="h-8 flex items-center justify-center text-sm text-slate-300">
                          29
                        </div>
                        <div className="h-8 flex items-center justify-center text-sm text-slate-300">
                          30
                        </div>
                        {[1, 2, 3, 4, 5].map((d) => (
                          <div
                            key={d}
                            className="h-8 flex items-center justify-center text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 rounded-lg cursor-pointer transition-colors"
                          >
                            {d}
                          </div>
                        ))}
                        <div className="h-8 flex items-center justify-center text-sm bg-indigo-600 text-white rounded-lg font-medium shadow-sm">
                          6
                        </div>
                        <div className="h-8 flex items-center justify-center text-sm bg-indigo-100 text-indigo-600 rounded-lg font-medium">
                          7
                        </div>
                        <div className="h-8 flex items-center justify-center text-sm bg-indigo-100 text-indigo-600 rounded-lg font-medium">
                          8
                        </div>
                        <div className="h-8 flex items-center justify-center text-sm bg-indigo-600 text-white rounded-lg font-medium shadow-sm">
                          9
                        </div>
                        {[10, 11, 12].map((d) => (
                          <div
                            key={d}
                            className="h-8 flex items-center justify-center text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 rounded-lg cursor-pointer transition-colors"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Location Picker */}
                  <div className="space-y-4">
                    <label className="block font-medium text-slate-900">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        className="h-12 pl-11 rounded-xl bg-slate-50 border-slate-200 font-medium"
                        placeholder="Search campus location..."
                      />
                    </div>
                    <div className="h-40 w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative group cursor-pointer">
                      <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80"
                        alt="Map"
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-70 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Action Bar */}
            {visible === "3" && (
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-4 pb-12 gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto font-medium text-slate-500 h-12 rounded-xl"
                >
                  Save Draft
                </Button>
                <div className="flex gap-4 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto cursor-pointer font-medium h-12 rounded-xl px-8 border border-gray-400"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto font-medium h-12 cursor-pointer rounded-xl px-10 bg-indigo-600 shadow-lg shadow-indigo-600/20 text-white text-md"
                  >
                    {isSubmitting ? "Processing..." : "List Item Now"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="font-heading text-2xl font-medium text-slate-900 mb-2">
              Item Listed!
            </h2>
            <p className="text-slate-500 font-medium mb-8">
              Your item is now visible to other verified students in the
              marketplace.
            </p>
            <Button
              className="w-full h-12 rounded-xl font-medium text-md shadow-lg shadow-indigo-600/20"
              disabled
            >
              Redirecting to Dashboard...
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
