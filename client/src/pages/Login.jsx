import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/store/authSlice";
import { Label } from "@/components/ui/label";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const toast = useToast();
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser({ ...data, isAdminLogin }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(isAdminLogin ? "Admin logged in successfully!" : "Successfully logged in!");
      navigate(isAdminLogin ? "/admin" : "/dashboard");
    } else {
      toast.error(resultAction.payload || "Failed to log in");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -right-[15%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl shadow-indigo-600/5 border border-white/50 relative z-10 animate-in zoom-in-95 fade-in duration-500">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-indigo-500 font-heading tracking-tight transition-colors duration-300">
            {isAdminLogin ? "Admin Login" : "User Login"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium transition-colors duration-300">
            {isAdminLogin ? "Sign in to access the admin dashboard" : "Sign in to continue to U-Share"}
          </p>
        </div>

        {/* Admin/User Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setIsAdminLogin(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isAdminLogin ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setIsAdminLogin(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isAdminLogin ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Admin Login
          </button>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-rose-700">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-bold text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className={`h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-rose-500 font-bold mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-bold text-sm">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
