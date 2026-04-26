import React from "react";
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

const Login = () => {
  const loginSchema = z.object({
    email: z.email({ message: "Please enter valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);
  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-indigo-500 font-heading tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-sans">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-rose-700">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-bold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`h-12 bg-slate-50 border-slate-200 ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
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
                <Label htmlFor="password" className="text-slate-700 font-bold">
                  Password
                </Label>
                <Link
                  to="#"
                  className="text-sm font-bold text-indigo-500 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`h-12 bg-slate-50 border-slate-200 ${errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
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
            className="w-full h-12 text-lg bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600 rounded-xl font-bold shadow-lg shadow-indigo-400/20"
            disabled={isSubmitting}
          >
            {isLoading ? "Authenticating..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 font-sans">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-indigo-500 hover:text-indigo-700 hover:underline"
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
