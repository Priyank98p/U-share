import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/context/ToastContext";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/users/forgot-password", data);
      setIsSuccess(true);
      if (res.data?.data?.resetUrl) {
        setResetLink(res.data.data.resetUrl);
      }
      toast.success(res.data.message || "Reset link sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -right-[15%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl shadow-indigo-600/5 border border-white/50 relative z-10 animate-in zoom-in-95 fade-in duration-500">
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-heading tracking-tight mb-2">
                Forgot Password?
              </h2>
              <p className="text-sm text-slate-500 font-medium px-4">
                No worries! Enter your campus email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-bold text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  className={`h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-rose-500 font-bold mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 py-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-50">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-heading">Check your email</h2>
            <p className="text-slate-500 font-medium text-sm">
              We've sent a password reset link to your email address. It will expire in 10 minutes.
            </p>

            {resetLink && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <p className="text-xs font-bold text-amber-800 uppercase mb-2">Development Mode</p>
                <a href={resetLink} className="text-sm font-medium text-indigo-600 hover:underline break-all">
                  {resetLink}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
