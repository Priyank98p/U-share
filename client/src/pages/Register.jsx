import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { loginUser } from "@/store/authSlice";
import { useToast } from "@/context/ToastContext";

const registerSchema = z.object({
  fullname: z.string().min(2, { message: "Full name is required." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  department: z.string().min(2, { message: "Department is required." }),
  year: z.string().min(1, { message: "Year is required." }),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("department", data.department);
      formData.append("year", data.year);

      const avatarFile = document.getElementById("avatar").files[0];
      const idCardFile = document.getElementById("studentIdCard").files[0];

      if (avatarFile) formData.append("avatar", avatarFile);
      if (idCardFile) formData.append("studentIdCard", idCardFile);

      // Register the user
      await axiosInstance.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Account created! Logging you in...");

      // Auto-login immediately after registration
      const result = await dispatch(loginUser({
        email: data.email,
        password: data.password,
      }));

      if (loginUser.fulfilled.match(result)) {
        navigate("/dashboard");
      } else {
        // Registration succeeded but auto-login failed — redirect to login
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <GraduationCap className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-indigo-500 font-heading tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-sans">
            Join the marketplace. All fields are required.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-slate-700 font-bold">Full Name</Label>
              <Input id="fullname" placeholder="Enter your fullname" className={`h-12 bg-slate-50 border-slate-200 ${errors.fullname ? "border-rose-500" : ""}`} {...register("fullname")} />
              {errors.fullname && <p className="text-sm text-rose-500 font-bold">{errors.fullname.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-bold">Username</Label>
              <Input id="username" placeholder="Enter your username" className={`h-12 bg-slate-50 border-slate-200 ${errors.username ? "border-rose-500" : ""}`} {...register("username")} />
              {errors.username && <p className="text-sm text-rose-500 font-bold">{errors.username.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-bold">Campus Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" className={`h-12 bg-slate-50 border-slate-200 ${errors.email ? "border-rose-500" : ""}`} {...register("email")} />
              {errors.email && <p className="text-sm text-rose-500 font-bold">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-bold">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" className={`h-12 bg-slate-50 border-slate-200 ${errors.password ? "border-rose-500" : ""}`} {...register("password")} />
              {errors.password && <p className="text-sm text-rose-500 font-bold">{errors.password.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-slate-700 font-bold">Department</Label>
              <Input id="department" placeholder="e.g. Computer Science" className={`h-12 bg-slate-50 border-slate-200 ${errors.department ? "border-rose-500" : ""}`} {...register("department")} />
              {errors.department && <p className="text-sm text-rose-500 font-bold">{errors.department.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-slate-700 font-bold">Year of Study</Label>
              <select id="year" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-slate-700" {...register("year")}>
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
              {errors.year && <p className="text-sm text-rose-500 font-bold">{errors.year.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-slate-700 font-bold">Profile Picture</Label>
              <Input id="avatar" type="file" accept="image/*" required className="h-12 bg-slate-50 border-slate-200 file:mr-4 file:px-4 file:rounded-full file:mb-1 file:border-0 file:text-sm file:bg-indigo-600/10 file:text-indigo-600 hover:file:bg-indigo-600/20 cursor-pointer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentIdCard" className="text-slate-700 font-bold">Student ID Card</Label>
              <Input id="studentIdCard" type="file" accept="image/*" required className="h-12 bg-slate-50 border-slate-200 file:mr-4 file:px-4 file:rounded-full file:mb-1 file:border-0 file:text-sm file:bg-indigo-600/10 file:text-indigo-600 hover:file:bg-indigo-600/20 cursor-pointer" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg rounded-xl font-bold bg-indigo-500 hover:bg-indigo-700 cursor-pointer text-white shadow-lg shadow-indigo-600/20 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 font-sans">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-indigo-500 hover:text-indigo-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
