import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/context/ToastContext";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post(`/users/reset-password/${token}`, {
        password: data.password,
      });
      toast.success(res.data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -right-[15%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-emerald-200/20 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl shadow-indigo-600/5 border border-white/50 relative z-10 animate-in zoom-in-95 fade-in duration-500">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 font-heading tracking-tight mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-slate-500 font-medium px-4">
            Enter your new password below to regain access to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-bold text-sm">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-rose-500 font-bold mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-bold text-sm">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${errors.confirmPassword ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-rose-500 font-bold mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-emerald-800">
              Ensure your new password is strong. We recommend using a mix of letters, numbers, and symbols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
